/*!
 * Website global methods | (c) Influence Digital 2014 | author: Jabran Rafique
 */

// Global object
var INFLUENCED = window.INFLUENCED || {};

INFLUENCED = {
	animate: true,
	init: function() {
		this.minHeightToSticky = this.homeDiv.height();
		this.clientsDivStart = this.minHeightToSticky;
		this.workDivStart = this.clientsDivStart + this.clientsDivStart;
		this.servicesDivStart = this.workDivStart + this.workDiv.height();
		this.contactDivStart = this.servicesDivStart + this.servicesDiv.height();

		// Enable carousel swipes
		this.workDiv.swipeleft(this.enableCarouselSwipe);
		this.workDiv.swiperight(this.enableCarouselSwipe);

		this.textToTweet();
		this.keepNavigationVisible();

		// Remove default animation css classes
		window.setTimeout(function()	{
			$('.animated.fadeInUp').removeClass('animated fadeInUp');
		}, 1000);

		// Update first section height to global object on resize
		$(window).resize(this.updateCoordsOnResize);

		var that = this;

		$(window).on('load', function()	{

			$.getJSON('https://api.instagram.com/v1/users/396527045/media/recent/?count=9&client_id=f4bce47624494cc79f65e13480af7058&callback=?', that.setUpInstagram);
			$.getJSON('http://influence.digital/lib/fetch-tweets.php', that.setUpTwitter);

			that.loadVideo('.ua-home');
		});

	},

	updateCoordsOnResize: function() {
		INFLUENCED.minHeightToSticky = INFLUENCED.homeDiv.height();
		INFLUENCED.clientsDivStart = INFLUENCED.minHeightToSticky;
		INFLUENCED.workDivStart = INFLUENCED.clientsDivStart + INFLUENCED.clientsDivStart;
		INFLUENCED.servicesDivStart = INFLUENCED.workDivStart + INFLUENCED.workDiv.height();
		INFLUENCED.contactDivStart = INFLUENCED.servicesDivStart + INFLUENCED.servicesDiv.height();
	},

	textToTweet: function() {

		if ( typeof Array.prototype.indexOf === 'undefined' ) {
			Array.prototype.indexOf = function(item) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] === item) {
						return i;
					}
					return -1;
				}
			}
		}

		String.prototype.setMentions = function() {
			var re = /@[A-Z0-9_]+/gi;
			return this.replace(re, function(match) {
				return '<a href="https://twitter.com/' + match + '" target="_blank">' + match + '</a>';
			});
		};

		String.prototype.setHash = function() {
			var re = /#[A-Z0-9_]+/gi;
			return this.replace(re, function(match) {
				return '<a href="https://twitter.com/search?q=' + encodeURIComponent(match) + '" target="_blank">' + match + '</a>';
			});
		};

		String.prototype.setUrl = function() {
			var re = /(((f|ht){1}(tp|tps):\/\/)[-a-zA-Z0-9@:%_\+\.~#?&\/\/=]+)/gi;
			return this.replace(re, function(match)	{
				return '<a href="' + match + '" target="_blank" class="link">' + match + '</a>';
			});
		};

		String.prototype.toTweet = function() {
			var that;
			that = this.setUrl();
			that = that.setMentions();
			that = that.setHash();
			return that;
		};

	},

	keepNavigationVisible: function() {
		var clientsContent = $('#clients .container').addClass('animated fadeOut'),
			servicesContent = $('#services .ua-section-parent-row').addClass('animated fadeOut'),
			contactContent = $('#contact .container').addClass('animated fadeOut');

		$(window).scroll(function(e)	{
			var st = $(window).scrollTop(),
				masthead = $('.ua-masthead');

			if ( st >= INFLUENCED.minHeightToSticky - 55 ) {
				masthead.addClass('sticky');
			}
			else {
				masthead.removeClass('sticky');
			}

			// Update animations
			if ( INFLUENCED.animate ) {
				if ( (st >= INFLUENCED.clientsDivStart - 150) && clientsContent.hasClass('fadeOut') )
					clientsContent.removeClass('fadeOut').addClass('fadeInUp');

				if ( (st >= INFLUENCED.servicesDivStart - 150) && servicesContent.hasClass('fadeOut') )
					servicesContent.removeClass('fadeOut').addClass('fadeInUp');

				if ( (st >= INFLUENCED.contactDivStart - 150) && contactContent.hasClass('fadeOut') )
					contactContent.removeClass('fadeOut').addClass('fadeInUp'), INFLUENCED.animate = false;
			}

			return;
		});	
	},

	toggleMobileNav: function(e) {
		e.preventDefault();
		var $this = $(this);

		if ( $this.hasClass('inactive-nav') ) {
			$this.hide(100, 'linear', function() {
				$('.active-nav, .nav-mobile-items').toggle(100, 'linear');
			});
		}
		else {
			$this.hide(100, 'linear', function() {
				$('.inactive-nav, .nav-mobile-items').toggle(100, 'linear');
			});
		}
	},

	navigateUser: function(e) {
		e.preventDefault();
		var $this = $(this),
			$href = $this.data('target') ? $this.data('target') : $this.attr('href'),
			$goto = $($href).offset().top;

		if ( $this.hasClass('nav-mobile') ) {
			$('.active-nav').hide(200, 'linear', function() {
				$('.inactive-nav, .nav-mobile-items').toggle(200, 'linear');
			});
		}

		$('html, body').animate({
			scrollTop: $goto - 45
		});
	},

	enableCarouselSwipe: function(e) {
		var $this = $(this);
		if ( e.type === 'swipeleft' ) {
			return $this.carousel('next');
		}
		else if ( e.type === 'swiperight' ) {
			return $this.carousel('prev');
		}
		else {
			return false;
		}
	},

	setUpInstagram: function(data) {
		var instagramFeed = $('.ua-instagram-feed');
		if ( data && data.data ) {
			var ul = $('<ul />', {'class': 'list-unstyled list-inline'}).appendTo(instagramFeed);
			for ( var i in data.data ) {
				var li = $('<li />').appendTo(ul);
				var hyperlink = $('<a />', {
					'href': data.data[i].link,
					// 'class': 'thumbnail',
					'target': '_blank'
				}).appendTo(li);

				var img = $('<img />', {
					'src': data.data[i].images.thumbnail.url,
					'alt': '',
					'width': '75',
					'height': '75'
				}).prependTo(hyperlink);
			}
		}
		else {
			instagramFeed.html('No instagram pictures.');
		}
	},

	setUpTwitter: function(data) {
		var twitterFeed = $('.ua-twitter-feed');
		if ( data && !data.errors ) {
			var ul = $('<ul />', {'class': 'list-unstyled'}).appendTo(twitterFeed);
			for ( var i in data ) {
				var li = $('<li />', {
					'id': data[i].id_str,
					'html': data[i].text.toTweet()
				}).appendTo(ul);
				var p = $('<p />', {
					'html': data[i].created_at.substr(0, 11) + data[i].created_at.substr(data[i].created_at.length - 4)
				}).prependTo(li);
			}
		}
		else {
			twitterFeed.html('Twitter feed is not available.');
			console.log(data.errors);
		}
	},

	loadVideo: function(target) {
		var $target = $(target);

		var video = $('<video autoplay loop />', {
			'width': $target.width(),
			'height': $target.height(),
			'poster': 'img/id-humming-bird.jpg'
		}).css({
			'position': 'absolute',
			'display': 'block',
			'min-width': '100%',
			'min-height': '100%',
			'width': 'auto',
			'height': 'auto',
			'left': '0',
			'right': '0',
			'top': '-90px',
			'bottom': '0'
		});
		
		var webm = $('<source />', {
			'src': '../img/humming-bird.webm'
		}).appendTo(video);
		
		var mp4 = $('<source />', {
			'src': '../img/humming-bird.mp4'
		}).appendTo(video);
		
		var ogv = $('<source />', {
			'src': '../img/humming-bird.ogv'
		}).appendTo(video);

		video.prependTo($target);
	}
};

/**
 * Post document ready functions
 */
$(document).ready(function()	{
	INFLUENCED.inactiveNav = $('.inactive-nav').on('click', INFLUENCED.toggleMobileNav);
	INFLUENCED.activeNav = $('.active-nav').on('click', INFLUENCED.toggleMobileNav);
	INFLUENCED.homeDiv = $('#home');
	INFLUENCED.clientsDiv = $('#clients');
	INFLUENCED.servicesDiv = $('#services');
	INFLUENCED.workDiv = $('#work');
	INFLUENCED.contactDiv = $('#contact');
	INFLUENCED.carousel = $('.carousel').carousel();
	INFLUENCED.navItem = $('.nav-item, .clients').on('click', INFLUENCED.navigateUser);
	INFLUENCED.workPopup = $('.ua-popup').magnificPopup({type: 'iframe', alignCenter: true, overflowY: 'scroll'});

	INFLUENCED.init();
});