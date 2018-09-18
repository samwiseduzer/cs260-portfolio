Router.config({
	root: '/',
	default: '/intro'
})
	.add({
		name: 'prod',
		path: '/products/{prodId}/edit/{prod2Id}',
		template: '/templates/test.html',
		handler: function(route) {
			console.log('route:', route);
		},
		resolver: {
			blah: route =>
				new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve('blah1');
					}, 1000);
				}),
			blah2: route =>
				new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve('blah2');
					}, 2000);
				})
		}
	})
	.add({
		name: 'intro',
		path: '/intro',
		template: '/templates/intro.html',
		handler: function(route) {
			console.log('route:', route);
		}
	})
	.add({
		name: 'projects',
		path: '/projects',
		template: '/templates/projects.html',
		handler: function(route) {
			console.log('route:', route);
		}
	})
	.add({
		name: 'work',
		path: '/work',
		template: '/templates/work.html',
		handler: function(route) {
			console.log('route:', route);
		}
	});
