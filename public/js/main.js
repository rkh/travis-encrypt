$("#encrypt").bind("click", function() {
  var output = $('#output');
  var repo   = $("#repo").val();
  var value  = $("#value").val();

  output.addClass("muted");
  output.text("loading…");

  say = function(html) {
    output.removeClass("muted");
    output.html(html);
  };

  error = function(message) {
    say("<span class='label label-important'>Error</span> " + message);
  }

  success = function(result) {
    if(result.key) {
      encrypted = cryptico.encrypt(value, result.key);
      if(encrypted.status === "success") {
        pre = $("<pre></pre>")
        pre.text('secure: "' + encrypted.cipher + '"');
        say('<p>Place the following in your <em>.travis.yml</em> instead of the unencrypted value:</p>');
        output.append(pre);
      } else {
        error(encrypted.status);
      }
    } else {
      error("Broken payload from Travis API");
    }
  };

  $.ajax({
    url: "https://api.travis-ci.org/repos/" + repo + "/key",
    headers: { Accept: 'application/json; version=2' },
    success: success,
    error: function() { error("Failed to retrieve key, does the repo exist?") }
  });
})

