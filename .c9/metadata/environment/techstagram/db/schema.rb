{"filter":false,"title":"schema.rb","tooltip":"/techstagram/db/schema.rb","ace":{"folds":[],"scrolltop":140,"scrollleft":0,"selection":{"start":{"row":25,"column":32},"end":{"row":25,"column":32},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":60,"mode":"ace/mode/ruby"}},"hash":"786c2dc8c1fa54c487c017e136dfe815e73b212c","mime":"text/x-script.ruby","undoManager":{"mark":1,"position":1,"stack":[[{"start":{"row":17,"column":0},"end":{"row":27,"column":0},"action":"insert","lines":["  create_table \"posts\", force: :cascade do |t|","    t.string \"image_url\"","    t.string \"icon_image\"","    t.string \"user_name\"","    t.text \"caption\"","    t.string \"location\"","    t.datetime \"created_at\", precision: 6, null: false","    t.datetime \"updated_at\", precision: 6, null: false","  end","",""],"id":2,"ignore":true}],[{"start":{"row":12,"column":46},"end":{"row":12,"column":47},"action":"remove","lines":["3"],"id":3,"ignore":true},{"start":{"row":12,"column":46},"end":{"row":12,"column":47},"action":"insert","lines":["4"]},{"start":{"row":12,"column":49},"end":{"row":12,"column":54},"action":"remove","lines":["71845"]},{"start":{"row":12,"column":49},"end":{"row":12,"column":54},"action":"insert","lines":["62010"]},{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["    t.integer \"like\", default: 0",""]}]]},"timestamp":1691994360992}