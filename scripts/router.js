Router.config({ root: '/', default: '/intro' })
	.add({
		name: 'prod',
		path: '/products/{prodId}/edit/{prod2Id}',
		handler: function() {
			console.log('prod');
			console.log('current:', Router.current);
		}
	})
	.add({
		name: 'intro',
		path: '/intro',
		handler: function() {
			console.log('intro');
			console.log('current:', Router.current);
		}
	})
	.add({
		name: 'projects',
		path: '/projects',
		handler: function() {
			console.log('projects');
			console.log('current:', Router.current);
		}
	})
	.add({
		name: 'work',
		path: '/work',
		handler: function() {
			console.log('work');
			console.log('current:', Router.current);
		}
	});
