require "bundler/setup"
Bundler.require
require "sinatra/reloader" if development?

enable :sessions

configure do
  set :title, "聖徳太子の楽しいクイズ王"
  set :colors, {0=>'#EBCBFF', 1=>'#FFC7C7', 2=>'#FFEDC9', 3=>'#97E4DA', 4=>'#EBCBFF', 5=>'#FFEDC9', 6=>'#97E4DA', 7=>'#FFEDC9', 8=>'FFC7C7'}
  set :quizzes, {
    5=>{
      question: "聖徳太子のお供は誰？",
      choices: [
        { text: "蘇我馬子", correct: false },
        { text: "小野妹子", correct: true },
        { text: "中大兄皇子", correct: false },
        { text: "藤原不比等", correct: false }
      ]
    },
    0=>{
    question: "聖徳太子の小さい頃の夢は？",
    choices: [
      { text: "エンジニア", correct: false },
      { text: "YouTuber", correct: false },
      { text: "国家体制の確立", correct: true },
      { text: "消防士", correct: false },
      ]
    },
     1=>{
       question: "最近聖徳太子が影で「妹子と〇〇は仲良し」と言った。それは何か。",
       choices: [
      { text: "ブリ", correct: false },
      { text: "サケ", correct: false },
      { text: "熊", correct: false },
      { text: "ツナ", correct: true },
      ]
     },
     2=>{
       question: "遣隋使で隋の国王と顔を合わせたが相手の見た目はなんだったか。",
       choices: [
         { text: "🐙", correct: true },
         { text: "👤", correct: false },
         { text: "🐈", correct: false },
         { text: "🐅", correct: false },
         ]
     },
     4=>{
       question: "聖徳太子の必殺技を答えてください。",
       choices: [
         { text: "飛鳥文化アタック", correct: true },
         { text: "摂政チョップ", correct: true },
         { text: "憲法十七条ちゃぶ台返し", correct: false },
         { text: "湯呑みマッスルアタック", correct: true },
         ]
     },
     3=>{
       question: "妹子が法隆寺に遊びに来た時の聖徳太子に対するお土産を挙げてください。",
       choices: [
         { text: "人形", correct: false },
         { text: "しゃもじ", correct: false },
         { text: "石と草", correct: true },
         { text: "湯呑み", correct: false },
         ]
     },
    6=>{
      question: "ここで歴史上の聖徳太子の本名をお答えください。",
      choices: [
         { text: "瀬戸弘司", correct: false },
         { text: "宇多田光", correct: false },
         { text: "厩戸皇子", correct: true },
         { text: "甚爾摩訶御", correct: false },
         ]
     },
     7=>{
      question: "「聖徳太子の楽しい木造建築」で登場するお菓子、「聖徳サブレ」の箱の左に書いてあるものは？",
      choices: [
         { text: "聖徳太子が心を込めて作ったよ♡", correct: false },
         { text: "隋の国王も大絶賛！", correct: false },
         { text: "生産工場：聖徳ッキング", correct: false },
         { text: "聖徳太子も食べたいし", correct: true },
         ]
     },
     8=>{
      question: "法隆寺を建てる時ケチって建設員1人しか雇わなかった。建築にあと何年かかることになっtか。",
      choices: [
         { text: "5年", correct: false },
         { text: "25年", correct: true },
         { text: "55年", correct: false },
         { text: "1年", correct: false },
         ]
     }
  }
  
end

$results = []

before do
  @title = settings.title
  @colors = settings.colors
  @quiz_length = settings.quizzes.length
  if session[:result] == nil
    session[:result] = []
  end
end

get '/' do
  session[:result] = []
  erb :index
end

get '/quiz/:id' do
  @quiz_id = params[:id].to_i
  if @quiz_id >= @quiz_length
    redirect '/'
  end
  @quiz = settings.quizzes[@quiz_id]
  erb :quiz
end

post '/quiz/:id' do
  quiz_id = params[:id].to_i
  choice_index = params[:choice_index].to_i

  session[:result][quiz_id] = {
    id: quiz_id,
    choice_index: choice_index,
    is_correct: settings.quizzes[quiz_id][:choices][choice_index][:correct]
  }
  if quiz_id == @quiz_length - 1
    redirect '/result'
  else
    redirect "/quiz/#{quiz_id + 1}"
  end
end

get '/result' do
  @correct_count = 0
  session[:result].each do |answer|
    if answer[:is_correct] == true
       @correct_count = @correct_count + 1
    end
  end
  erb :result
end

get '/result/:id' do
  @quiz_id = params[:id].to_i
  if $results.length == 0 || @quiz_id >= @quiz_length
    redirect "/"
  end
  @quiz = settings.quizzes[@quiz_id]
  @quiz_result = []
  $results.each do |result|
    @quiz_result.push(result[:detail][@quiz_id])
  end
  @choice_counts = @quiz_result.group_by { |h| h[:choice_index] }.transform_values(&:count)
  @sorted_counts = @choice_counts.sort_by { |_, v| v }.to_h.transform_values(&:to_f).transform_values { |v| (v / @quiz_result.length * 100).to_i }
  erb :record
end

get '/ranking' do
  if $results.length == 0
    redirect "/"
  end
  @results = $results
  erb :ranking
end

post '/ranking/new' do
  if session[:result] == []
    redirect '/'
  end
  correct_num = 0
  session[:result].each do |answer|
    if answer[:is_correct] == true
      correct_num = correct_num + 1
    end
  end
  $results.push({
    name: params[:name],
    score: correct_num,
    detail: session[:result]
  })
  session[:result] = []
  redirect "/result/0"
end
