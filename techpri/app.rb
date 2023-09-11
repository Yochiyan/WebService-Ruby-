require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require 'securerandom'

require './photo_manager.rb'
require './face_api_service.rb'
require './search.rb'

enable :sessions

# 以下にコードを記載
get '/' do
  set_emotion(Emotions. happy)
  erb :index
end

post '/take_photo' do
id = SecureRandom.uuid[0, 5]
save_photo(id, params[:photo1], params[:photo2], params[:photo3])
redirect "/photo/#{id}"
end

get '/photo/:id' do 
  @src_array = read_photo(params[:id])
  @id = params[:id]
  erb :photo
end
# コードの記載終わり

# --- ここからは写真を取る際に使われるコードです ---
# beforeをつけることで、/take_photoのget・post通信が行われる前に処理をすることができます。
# ここでは顔が検出されなかった場合・感情が足りなかった場合には、他の画面に移るという処理を書いています。
before '/take_photo' do
  if params[:message] == Results.noFace
    redirect '/result/no_face'
  elsif params[:message] == Results.lessEmotion
    session[:emotion_value] = params[:emotion_value]
    redirect "/result/less_emotion"
  elsif params[:message] != Results.success
    puts 'エラーが起きたみたい…もう一度試してね！'
    redirect '/'
  end
end

# 顔が検出されなかった場合のURIです。
get '/result/no_face' do
  erb :result_no_face
end

# 感情が足りなかった場合のURIです。
get '/result/less_emotion' do
  @emotion_percent_name = emotion_percent_name(session[:emotion])
  @emotion_value = session[:emotion_value]

  erb :result_less_emotion
end

# Emotionsに対応して、どのような文章を表示するかを決めています。
def emotion_percent_name(emotion)
  if emotion.nil? || emotion.empty?
    return '感情'
  else
    case emotion
    when Emotions.angry then
      return 'いかり度'
    when Emotions.disgusted then
      return 'うんざり度'
    when Emotions.fearful then
      return 'きょうふ度'
    when Emotions.happy then
      return 'えがお度'
    when Emotions.neutral then
      return 'まがお度'
    when Emotions.sad then
      return 'かなしみ度'
    when Emotions.surprised then
      return 'おどろき度'
    else
      return '感情'
    end
  end
end
