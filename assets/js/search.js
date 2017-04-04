var $input = $(".typeahead");

function _normalizeData(data) {
 data.forEach(function(element) {
    element.name = element.login;
});
 return data;
}

$input.typeahead(
{
    source: function (query, process) {
       var keyNameSpace = 'search-users-';
       var resultLocalStorage = lscache.get(keyNameSpace + query.toLowerCase());
       if (resultLocalStorage === null) {
          return $.get('https://api.github.com/search/users', { q: query }, function (data) {
              var normalizedData = _normalizeData(data.items);
              lscache.set(keyNameSpace + query.toLowerCase(), normalizedData, 5);
              return process(normalizedData); 
          });
      } else {
          return process(resultLocalStorage);
      }
  },
  minLength: 3,
  fitToElement: true,
});
function createUserCard (data) {
  var $userData = $('.user-data')
  $userData.empty();

  var login = data.login;
  var name = data.name || '';
  var company = data.company || '';
  var location = data.location || '';
  var followers = data.followers;
  var following = data.following;
  var email = data.email || '';
  var avatarUrl = data.avatar_url;
  var htmlUrl = data.html_url;

  var createdAt = data.created_at;
  var structuredCreatedAt = moment(createdAt).format('LLLL');



  var svgGitHub = '<svg height="32" version="1.1" viewBox="0 0 16 16" width="32"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>';

  var html = '';
  html += '<div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">';
  html += '<div class="panel panel-default" ><div class="panel-heading text-left">';
  html += '<a href="' + htmlUrl + '" class="pull-right btn-lnk small">' + svgGitHub + '</a>'; 
  html += '<h4 >' + login + '</h4></div>';
  html += '<div class="panel-body text-primary"><div class="well well-sm"><div class="media"><a class="pull-left" href=' + avatarUrl + '>';
  html += '<img class="thumbnail img-responsive" width="150" height="150" src=' + avatarUrl + '></a>';
  html += '<div class="media-body text-left">';
  html += '<h4 class="media-heading"><strong>Nome: </strong>' + name + '</h4>';
  html += '<p><strong>Empresa: </strong>' + company + '</p>';
  html += '<p><strong>Localidade: </strong>' + location + '</p>';
  html += '<p><strong>E-mail: </strong>' + email+'</p>';
  html += '<p><strong>Criado em: </strong>' + structuredCreatedAt + '</p>';
  html += '<p><span class="btn btn-sm btn-primary">' + followers + ' seguidores</span> <span class="btn btn-sm btn-primary">' + following + ' seguindo</span></p>';
  html += '</div></div></div></div></div></div>';

  $userData.html(html);

};

$input.change(function() {
    var current = $input.typeahead("getActive");
    if (current && current.name == $input.val()) {
       var keyNameSpace = 'user-';
       var resultLocalStorage = lscache.get(keyNameSpace + current.name);
       if (resultLocalStorage === null) {
          $.get('https://api.github.com/users/' + current.name, function(data) {
            lscache.set(keyNameSpace + current.name, data, 5);
             createUserCard(data);
         });
      } else {
          createUserCard(resultLocalStorage);
      }
  }
});