# app.rbにもこのようなものが書いてありましたが、これによってsinatraというフレームワークを読み込んでいます。
# sinatraというのはこのWebサービスを支える基盤のようなもので、これを読み込んでいるからとても簡単にWebサービスの開発ができます。
require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require 'securerandom'

# 教科書では書きませんでしたが、ここに検索画面を表示するコードが書いてあります。
get '/search' do
  @message = params[:message]
  erb :search
end

# これは与えられたidに対応する写真フォルダが存在するかを確認するAPIです。
# これをJavaScript側から呼び出しており、ユーザーから見えないところでサーバーと情報をやりとりすることを可能にしています。
get '/search_photo/:photo_id' do
  id = params[:photo_id]
  if Dir.exist?("public/img/archive/#{id}")
    return "exist"
  else
    return "error"
  end
end