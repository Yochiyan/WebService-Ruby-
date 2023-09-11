require 'bundler/setup'
Bundler.require
require 'sinatra/reloader' if development?
require './models.rb'
# dotsenv
require 'dotenv/load'
# cloudinary
require 'cloudinary'
require 'cloudinary/uploader'
require 'cloudinary/utils'

before do
  Dotenv.load
  Cloudinary.config do |config|
    config.cloud_name = ENV['CLOUD_NAME']
    config.api_key = ENV['CLOUDINARY_API_KEY']
    config.api_secret = ENV['CLOUDINARY_API_SECRET']
    config.secure = true
  # パスからpage_nameを指定する
  path = request.fullpath.split("/").last
  case path
  when "newpost" then
    @page_name = "newpost"
  else
    @page_name = "home"
  end
end
end

get'/' do 
  @posts = Post.order(created_at: :desc)
  erb :index
end

get "/newpost" do
  erb :newpost
end

post '/newpost' do
  if params[:upload_photo]
    image = params[:upload_photo]
    tempfile = image[:tempfile]
    upload = Cloudinary::Uploader.upload(tempfile.path)
    img_url = upload['url']
  else
    img_url = url("img/user_img_nil.png")
  end 
  
 post = Post.create(
   image_url: img_url,
   icon_image: params[:icon_image],
   user_name: params[:user_name],
   caption: params[:caption],
   location: params[:location]
  )
  redirect '/'
end 

get '/:id/edit' do
  @post = Post.find(params[:id])
  erb :editpost
end 

post'/:id/edit' do
  post = Post.find(params[:id])
  if params[:upload_photo]
    image = params[:upload_photo]
    tempfire = image[:tempfile]
    upload = Cloudinary::Upload(tempdfire.path)
    img_url = upload['url']
  else
    img_url = post.image_url
end

post.update(
  image_url: img_url,
  icon_image: params[:icon_image],
  user_name: params[:user_name],
  caption: params[:caption],
  location: params[:location],
  like: 0
)
redirect '/'
end

get '/:id/delete' do
  post = Post.find(params[:id])
  post.destroy
  redirect '/'
end

post '/:id/like' do
  post = Post.find(params[:id])
  post.update({
   like: post.like + 1
  })
  content_type :json
  data = {
    like: post.like
  }
  data.to_json
end 