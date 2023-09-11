# ここでは写真をサーバーに保存する処理を書いています。
def save_photo(id, photo1, photo2, photo3)
  # archiveというフォルダの中に写真が保存されるのですが、archiveが間違って消えていたりすると動かなくなってしまいます。
  # なので先に、archiveフォルダがなければ作る処理をしています。
  if !Dir.exist?("public/img/archive")
    Dir.mkdir("public/img/archive")
  end

  # 生成されたidから、新しいフォルダを作ります。
  # みなさんにはapp.rbでidを生成してもらいましたが、これはUUIDというものを用いています。
  # 興味があればメンターさんに聞いてみたり、調べてみたりしてくださいね。
  Dir.mkdir("public/img/archive/#{id}")
  
  # 写真1,2,3をそれぞれ保存しています。
  file1 = File.new("public/img/archive/#{id}/1.jpg", "wb")
  file1.write(photo1)
  file1.close
  
  file2 = File.new("public/img/archive/#{id}/2.jpg", "wb")
  file2.write(photo2)
  file2.close
  
  file3 = File.new("public/img/archive/#{id}/3.jpg", "wb")
  file3.write(photo3)
  file3.close
end

# ここでは保存された画像を呼び出しています。
# この関数を呼び出す前に、idに対応するフォルダがあるかを確認しているので、見つからなかった場合の処理は書いていません。
def read_photo(id)
  # これは配列というもので、ここに画像1,2,3のデータを順番に入れていきます。
  src_array = ['', '', '']

  # ここで順番に画像1,2,3を呼び出し、配列に保存していきます。
  file1 = File.open("public/img/archive/#{id}/1.jpg", "rb")
  src_array[0] = file1.read
  file1.close
  
  file2 = File.open("public/img/archive/#{id}/2.jpg", "rb")
  src_array[1] = file2.read
  file2.close
  
  file3 = File.open("public/img/archive/#{id}/3.jpg", "rb")
  src_array[2] = file3.read
  file3.close
  
  # この関数を呼び出しているところに、作成した配列を返しています。これを戻り値と言います。
  # 関数や戻り値などについては、今後の教科書で触れることになります。楽しみにしててくださいね。
  return src_array
end