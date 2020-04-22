$(function(){

  function buidHTML(message) {
    if ( message.image ) {
      var html = 
        `<div class="message" data-message-id=${message.id}>
          <div class="upperMessage">
            <div class="upperMessage__user-name">
              ${message.user_name}
            </div>
            <div class="upperMessage__date">
              ${message.created_at}
            </div>
          </div>
          <div class="lowerMessage">
            <p class="lowerMessage__content">
              ${message.content}
            </p>
          </div>
          <img src=${message.image} >
        </div>`
      return html;
    } else {
      var html =
        `<div class="message" data-message-id=${message.id}>
          <div class="upperMessage">
            <div class="upperMessage__user-name">
              ${message.user_name}
            </div>
            <div class="upperMessage__date">
              ${message.created_at}
            </div>
          </div>
          <div class="lowerMessage">
            <p class="lowerMessage__content">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false,
    })
      .done(function(data) {
        var html = buidHTML(data);
        $(".messages").append(html);
        $('form')[0].reset();
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
        $('.submitBtn').prop("disabled", false);
      })
      .fail(function() {
        alert("メッセージ送信に失敗しました");
    });
  });


  var reloadMessages = function() {
    console.log("reload")
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通りのURLを指定
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.log(messages)
      // if (messages.length !== 0) {
        console.log("if")
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        messages.forEach(function(message){
        // $.each(messages, function(i, message) {
          insertHTML = buidHTML(message)
        
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      });
      // }
    })
    .fail(function() {
      alert('error');
    });
    //$(function(){});の閉じタグの直上(処理の最後)に以下のように追記
  };
      if (document.location.href.match(/\/groups\/\d+\/messages/)) {
        setInterval(reloadMessages, 7000);
      }
});