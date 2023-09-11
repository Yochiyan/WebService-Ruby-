require 'bundler/setup'
Bundler.require

require './app'

run Sinatra::Application
