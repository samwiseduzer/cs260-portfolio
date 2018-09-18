Router.config({
	default: '/intro'
})
	.add({
		name: 'prod',
		path: '/products/{prodId}/edit/{prod2Id}',
		templateURL: '/templates/test.html',
		prerender: function(route) {
			console.log("hi - I'm prerender");
			this.blah = 'hello, sir';
			this.blahs = [1, 2, 3, 4, 5];
			this.apple = route.params.prodId;
		},
		controller: function(route) {
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
					}, 500);
				})
		}
	})
	.add({
		name: 'intro',
		path: '/intro',
		templateURL: '/templates/intro.html',
		controller: function(route) {
			console.log('route:', route);
		}
	})
	.add({
		name: 'projects',
		path: '/projects',
		templateURL: '/templates/projects.html',
		controller: function(route) {
			console.log('route:', route);
		}
	})
	.add({
		name: 'work',
		path: '/work',
		templateURL: '/templates/work.html',
		controller: function(route) {
			console.log('route:', route);
		}
	});
