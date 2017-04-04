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
				return $.get('https://api.github.com/search/users', { q: query }, function (data) {
					var normalizedData = _normalizeData(data.items)
					return process(normalizedData);
				});
			},
			minLength: 3,
			fitToElement: true,
			// templates: {
			// 	suggestion: function (data) {
			// 		console.log(data)
			// 		return '<p><strong>' + data.login + '</strong> - ' + data.id + '</p>';
			// 	}
			// }
		});
		$input.change(function() {
			var current = $input.typeahead("getActive");
			if (current) {
    // Some item from your model is active!
    if (current.name == $input.val()) {
    	$.get('https://api.github.com/users/' + current.name, function (data) {
    		var $userData = $('.user-data')
    		$userData.empty();

    		var login = data.login;
    		var name = data.name;
    		var company = data.company;
    		var location = data.location;
    		var followers = data.followers;
    		var following = data.following;
    		var email = data.email;
    		var avatarUrl = data.avatar_url;
    		var html_url = data.html_url;

    		var createdAt = data.created_at;
    		var structuredCreatedAt = moment(createdAt).format('LLLL');

    		var htmlUrl = data.html_url;

    		var html = '';

    		html += '<div class="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4"><div class="panel panel-default" ><div class="panel-heading text-left" style="padding: 0px; padding-left: 10px"><a href="' + html_url + '" class="pull-right btn-lnk small" style="color:blue">Ver perfil no github.com</a> <h4 >' + login + '</h4></div>'
    		html += '<div class="panel-body text-primary"><div class="well well-sm"><div class="media"><a class="pull-left" href='+avatarUrl+'><img class="thumbnail img-responsive" width="150" height="150" src=' + avatarUrl + '></a>'
    		html += '<div class="media-body text-left"><h4 class="media-heading" style="margin-bottom: 10px"><strong>Nome: </strong>'+name+'</h4><p><strong>Empresa: </strong>'+company+'</p><p><strong>Localidade: </strong>'+location+'</p><p><strong>E-mail: </strong>'+email+'</p><p><strong>Criado em: </strong>'+structuredCreatedAt+'</p><p><span class="btn btn-sm btn-primary">'+followers+' seguidores</span> <span class="btn btn-sm btn-primary">'+following+' seguindo</span></p></div></div></div></div></div></div>'

    		$userData.html(html);

    	});
      // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
  } else {
      // This means it is only a partial match, you can either add a new item
      // or take the active if you don't want new items
  }
} else {
    // Nothing is active so it is a new value (or maybe empty value)
}
});