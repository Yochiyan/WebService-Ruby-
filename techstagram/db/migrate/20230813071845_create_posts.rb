class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.string :image_url
      t.string :icon_image
      t.string :user_name
      t.text :caption
      t.string :location
      t.timestamps null: false
  end
end
end
