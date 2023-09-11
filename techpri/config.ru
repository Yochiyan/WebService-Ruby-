# ここではAIテクプリ全体の初期設定のようなものをしています。
require 'bundler'
Bundler.require

require './app'
run Sinatra::Application
