# ここでは検出する感情を設定しています。
def set_emotion(emotion)
  session[:emotion] = emotion
  # @が頭についているものはインスタンス変数といって、erbファイルに受け渡すことができます。
  @emotion = emotion
end

# ここでは検出できる感情の一覧を定義しています。
# このように定義しておくことで、タイピングミスを防いだり、どんな種類があったのかがわかりやすくなったりと便利です。
class Emotions
  def self.angry
    'angry'
  end

  def self.disgusted
    'disgusted'
  end

  def self.fearful
    'fearful'
  end

  def self.happy
    'happy'
  end

  def self.neutral
    'neutral'
  end

  def self.sad
    'sad'
  end

  def self.surprised
    'surprised'
  end
end

# ここでは加工の時に起こりうる結果をおおよそ分類して定義しています。
# 上のように決めておくことでちょっと便利です。
class Results
  def self.success
    'success'
  end

  def self.noFace
    'no face'
  end

  def self.lessEmotion
    'less emotion'
  end
end
