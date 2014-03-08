$( document ).ready( function ( e ) {

	// define additional jquery functions
	jQuery.fn.extend({
		any: function ( e ) {
			return this.length > 0;
		}
	});

	// define user variables
	var repeatSong = false;
	var repeatSongs = false;

	// define system variables
	var playbackEnabled = true;
	var y = 0;
	
	// create empty objects
	var initialisationKit = { /* empty object */ };
	var audioKit = { /* empty object */ };
	var interfaceKit = { /* empty object */ };

	// ------------------------------------------------------------
	// initialisationKit: methods relating to object initialisation
	// ------------------------------------------------------------

	// initialiseTracks()
	// initialiseSeekbar()
	// initialiseKeyEventAgent()
	// initialiseClickEventAgent()

	initialisationKit.initialiseTracks = function ( e ) {
		var title = '';
		var artist = '';
		var album = '';
		var type = '';
		var source = '';
		var codec = '';
		$( 'li.track' ).each( function ( e ) {
			title = $( this ).attr( 'data-title' );
			artist = $( this ).attr( 'data-artist' );
			album = $( this ).attr( 'data-album' );
			type = $( this ).attr( 'data-type' );
			source = 'library/' + artist + '/' + title + type;
			codec = 'audio/mpeg';
			if ( type == '.mp3') {
				codec = 'audio/mpeg';
			} else if ( type == '.m4a' ) {
				codec = 'audio/mp4';
			} else { /* unrecognized codec */ }
			$( this ).html( '<audio></audio>' );
			$( this ).find( 'audio' ).on( 'loadedmetadata', function ( e ) {
				var seconds = $( this )[ 0 ].duration;
				sec = Math.floor( seconds );
				min = Math.floor( sec / 60 );
				min = min >= 10 ? min : '0' + min;
				sec = Math.floor( sec % 60 );
				sec = sec >= 10 ? sec : '0' + sec;
				var appendation = '<span>' + min + ':' + sec + '</span>';
				$( this ).parent().append( appendation );
			});
			$( this ).append( '<span class="title">' + title + '</span>' );
			$( this ).append( '<span class="artist">' + artist + '</span>' );
			$( this ).append( '<span class="album">' + album + '</span>' );
			$( 'audio', this ).attr( 'src', source );
		});
	};

	initialisationKit.initialiseSeekbar = function ( e ) {
		interfaceKit.updateProgressBar();
		var target = $( 'audio.played' );
		$( 'input#seekbar' )[ 0 ].max = $( 'audio.played' )[ 0 ].duration;
		$( 'audio.played' ).on( 'timeupdate seeking', function ( e ) {
			if ( playbackEnabled ) {
				$( 'input#seekbar' )[ 0 ].value = $( 'audio.played' )[ 0 ].currentTime;
			}
			$( 'span.trackstart' ).html( interfaceKit.formatDuration( $( 'audio.played' )[ 0 ].currentTime ) );
			interfaceKit.updateProgressBar();
		});
		$( 'span.trackstart' ).html( interfaceKit.formatDuration( $( 'audio.played' )[ 0 ].currentTime ) );
		$( 'span.trackend' ).html( interfaceKit.formatDuration( $( 'audio.played' )[ 0 ].duration ) );
		$( 'span.trackstart, span.trackend, div#nowplaying, div#progressbar, span.repeat' ).transition({
			duration:1000,
			opacity:1
		});
		$( 'span.tracktitle' ).html( target.parent().attr( 'data-title' ) + ' &#8212; ' );
		$( 'span.trackartist' ).html( target.parent().attr( 'data-artist' ) + ' &#8212; ' );
		$( 'span.trackalbum' ).html( target.parent().attr( 'data-album' ));
		$( 'input#seekbar' ).on( 'input', function ( e ) {
			interfaceKit.updateSeekBar();
		});
	};

	initialisationKit.initialiseDocumentObects = function ( e ) {
		$( 'ul#playlist, div#controlbar' ).transition({
			duration:3000,
			opacity:1
		});
		$( 'li.track:first-child' ).addClass( 'selected' );
	};

	initialisationKit.initialiseKeyEventAgent = function ( e ) {
		interfaceKit.keyEventAgent();
	};

	initialisationKit.initialiseClickEventAgent = function ( e ) {
		interfaceKit.clickEventAgent();
	};

	// -------------------------------------------------------
	// interfaceKit: methods relating to objection interaction
	// -------------------------------------------------------

	// sortTracks()
	// sortTracksByTitle()
	// sortTracksByArtist()
	// showAlert()
	// dispatchAlert()
	// showActivity()
	// removeActivity()
	// updateSeekBar()
	// updateProgressBar()
	// formatDuration()
	// keyEventAgent()
	// clickEventAgent()

	interfaceKit.sortTracks = function ( attribute, order ) {
		if ( attribute == 'title' ) {
			if ( order == 'a-z' ) {
				interfaceKit.sortTracksByTitle( 'a-z' );
			} else if ( order == 'z-a' ) {
				interfaceKit.sortTracksByTitle( 'z-a' );
			} else { /* invalid order argument */ }
		} else if ( attribute == 'artist' ) {
			if ( order == 'a-z' ) {
				interfaceKit.sortTracksByArtist( 'a-z' );
			} else if ( order == 'z-a' ) {
				interfaceKit.sortTracksByArtist( 'z-a' );
			} else { /* invalid order argument */ }
		} else { /* invalid attribute argument */ }
	};
	
	interfaceKit.sortTracksByTitle = function ( order ) {
		if ( order == 'a-z' ) {
			order = function ( a, b ) { return ( $( b ).attr( 'data-title' ) ) < ( $( a ).attr( 'data-title' ) ) ? 1 : -1; };
			$( 'ul#playlist li.track' ).sort( order ).appendTo( 'ul#playlist' );
		} else if ( order == 'z-a' ) {
			order = function ( a, b ) { return ( $( b ).attr( 'data-title' ) ) > ( $( a ).attr( 'data-title' ) ) ? 1 : -1; };
			$( 'ul#playlist li.track' ).sort( order ).appendTo( 'ul#playlist' );
		} else { alert( 'Error: "interfaceKit.sortTracksByTitle()".' ); }
	};
	
	interfaceKit.sortTracksByArtist = function ( order ) {
		if ( order == 'a-z' ) {
			order = function ( a, b ) { return ( $( b ).attr( 'data-artist' ) ) < ( $( a ).attr( 'data-artist' ) ) ? 1 : -1; };
			$( 'ul#playlist li.track' ).sort( order ).appendTo( 'ul#playlist' );
		} else if ( order == 'z-a' ) {
			order = function ( a, b ) { return ( $( b ).attr( 'data-artist' ) ) > ( $( a ).attr( 'data-artist' ) ) ? 1 : -1; };
			$( 'ul#playlist li.track' ).sort( order ).appendTo( 'ul#playlist' );
		} else { alert( 'Error: "interfaceKit.sortTracksByArtist()".' ); }
	};
	
	interfaceKit.showAlert = function ( type, target ) {
		var icon = '';
		var messagetitle = '';
		var messagecontent = '';
		var message = '';
		var appendation = '';
		if ( type == 'Now Playing' || type == 'Paused' ) {
			var title = target.attr( 'data-title' );
			var artist = target.attr( 'data-artist' );
			messagetitle = '<p>' + title + '</p>';
			messagecontent = '<p>' + artist + '</p>';
			if ( type == 'Now Playing' ) {
				icon = '<i class="fa fa-play"></i>';
			} else if ( type == 'Paused' ) {
				icon = '<i class="fa fa-pause"></i>';
			}
			message = icon + messagetitle + messagecontent;
			appendation = '<div class="alert">' + message + '</div>';
			$( 'body' ).append( appendation );
			interfaceKit.dispatchAlert( message );
		} else if ( type == 'Repeat Song' || type == 'Repeat Playlist' ) {
			if ( type == 'Repeat Song' ) {
				icon = '<i class="fa fa-repeat fa-spin"></i>';
				messagetitle = '<p>Repeat Song Enabled</p>';
				messagecontent = '<p>Each song will repeat</p>';
			} else if ( type == 'Repeat Playlist' ) {
				icon = '<i class="fa fa-refresh fa-spin"></i>';
				messagetitle = '<p>Repeat Playlist Enabled</p>';
				messagecontent = '<p>The playlist will repeat</p>';
			}
			message = icon + messagetitle + messagecontent;
			appendation = '<div class="alert">' + message + '</div>';
			$( 'body' ).append( appendation );
			interfaceKit.dispatchAlert( message );
		} else if ( type == 'No Repeat' ) {
			messagetitle = '<p>Repeat Disabled</p>';
			messagecontent = '<p>Songs and playlist will not repeat</p>';
			icon = '<i class="fa fa-ban"></i>';
			message = icon + messagetitle + messagecontent;
			appendation = '<div class="alert">' + message + '</div>';
			$( 'body' ).append( appendation );
			interfaceKit.dispatchAlert( message );
		} else if ( type == 'Playlist Ended' ) {
			messagetitle = '<p>Playlist Ended</p>';
			messagecontent = '<p>Reached end of playlist</p>';
			icon = '<i class="fa fa-stop"></i>';
			message = icon + messagetitle + messagecontent;
			appendation = '<div class="alert">' + message + '</div>';
			$( 'body' ).append( appendation );
			interfaceKit.dispatchAlert( message );
		} else { /* unrecognized type */ }
	};

	interfaceKit.dispatchAlert = function ( message ) {
		$( 'div.alert' ).each( function ( e ) {
			if ( $( this ).html() == message ) {
				$( this ).transition({
					opacity:1.0
				}).transition({
					opacity:0.0,
					delay:3000
				}, function ( e ) {
					$( this ).remove();
				});
			} else { $( this ).remove(); }
		});
	};

	interfaceKit.showActivity = function ( target ) {
		interfaceKit.removeActivity( target );
		target.addClass( 'activity' );
	};

	interfaceKit.removeActivity = function ( target ) {
		$( 'li' ).not( target ).removeClass( 'activity' );
	};
	
	interfaceKit.updateSeekBar = function ( e ) {
		playbackEnabled = false;
		var audio = $( 'audio.played' )[ 0 ];
		var input = $( 'input#seekbar' )[ 0 ];
		audio.currentTime = input.value;
		playbackEnabled = true;
	};
	
	interfaceKit.updateProgressBar = function ( e ) {
		var audio = $( 'audio.played' )[ 0 ];
		var value = 0;
		if ( audio.currentTime > 0 ) {
			var subval1 = 100 / $( 'audio.played' )[ 0 ].duration;
			var subval2 = $( 'audio.played' )[ 0 ].currentTime;
			value = subval1 * subval2;
		}
		var percent = value + '%';
		$( 'div#progress' ).css({
			transition:'width 0.1s',
			width:percent
		});
	};
	
	interfaceKit.formatDuration = function ( seconds ) {
		sec = Math.floor( seconds );
		min = Math.floor( sec / 60 );
		min = min >= 10 ? min : '0' + min;
		sec = Math.floor( sec % 60 );
		sec = sec >= 10 ? sec : '0' + sec;    
		return min + ':' + sec;
	};

	interfaceKit.keyEventAgent = function ( e ) {
		$( document ).keydown( function ( e ) {
			var target = $( 'li.selected' );
			var first = $( 'li:first-child' );
			var last = $( 'li:last-child' );
			e.preventDefault();
			if ( e.keyCode == 13 ) { // enter
				if ( target.next().any() ) {
					target.removeClass( 'selected' );
					target.next().addClass( 'selected' );
					//y = $( '#wrapper' ).scrollTop() + 48;
					//$( '#wrapper' ).animate({
					//	scrollTop: y + $( window ).scrollTop()
					//}, 50 );
				} else {
					target.removeClass( 'selected' );
					first.addClass( 'selected' );
					//$( '#wrapper' ).animate({
					//	scrollTop: 0
					//}, 50 ); 
				}
			} else if ( e.keyCode == 32 ) { // space
				audioKit.togglePlayback();
			} else if ( e.keyCode == 37 ) { // left
				audioKit.playPreviousTrack();
			} else if ( e.keyCode == 38 ) { // up
				if ( target.any() ) {
					if ( target.prev().any() ) {
						target.removeClass( 'selected' );
						target.prev().addClass( 'selected' );
					} else { //reached top of playlist
					}
					//y = $( '#wrapper' ).scrollTop() - 48;
					//$( '#wrapper' ).animate({
					//	scrollTop: y - $( window ).scrollTop()
					//}, 50 );
				} else {
					last.addClass( 'selected' );
				}
			} else if ( e.keyCode == 39 ) { // right
				audioKit.playNextTrack();
			} else if ( e.keyCode == 40) { // down
				e.preventDefault(); // TESTING ONLY
				if ( target.any() ) {
					if ( target.next().any() ) {
						target.removeClass( 'selected' );
						target.next().addClass( 'selected' );
					} else {
						// reached bottom of playlist
					}
					e.preventDefault();
					//y = $( '#wrapper' ).scrollTop() + 48;
					//$( '#wrapper' ).animate({
					//	scrollTop: y + $( window ).scrollTop()
					//}, 50 );
				} else {
					first.addClass( 'selected' );
				}
			} else {
				// unknown keycode
			}
		});
	};

	interfaceKit.clickEventAgent = function ( e ) {
		$( 'li.track' ).on( 'mousedown', function ( e ) {
			$( this ).addClass( 'selected' );
			$( 'li.track' ).not( this ).removeClass( 'selected' );
		});
		$( 'span.prev' ).click( function ( e ) {
			audioKit.playPreviousTrack();
		});
		$( 'span.next' ).click( function ( e ) {
			audioKit.playNextTrack();
		});
		$( 'span.prev, span.next, span.repeat' ).hover( function ( e ) {
			$( this ).transition({
				'backgroundColor':'rgba( 255, 255, 255, 0.05 )',
				duration:200
			});
		}, function ( e ) {
			$( this ).transition({
				'backgroundColor':'transparent',
				duration: 400
			});
		});
		$( 'span.repeat' ).click( function ( e ) {
			if ( repeatSong === false && repeatSongs === false ) {
				repeatSong = true;
				$( this ).html( '<i class="fa fa-repeat fa-spin">' );
				interfaceKit.showAlert( 'Repeat Song', '' );
			} else if ( repeatSong === true && repeatSongs === false ) {
				repeatSongs = true;
				$( this ).html( '<i class="fa fa-refresh fa-spin">' );
				interfaceKit.showAlert( 'Repeat Playlist', '' );
			} else if ( repeatSong === true && repeatSongs === true ) {
				repeatSong = false;
				repeatSongs = false;
				$( this ).html( '<i class="fa fa-ban">' );
				interfaceKit.showAlert( 'No Repeat', '' );
			}
		});
	};

	// ------------------------------------------------
	// audioKit: methods relating to audio manipulation
	// ------------------------------------------------

	// togglePlayback()
	// startPlayback()
	// stopPlayback()
	// pausePlayback()
	// regulatePlayback()
	// playNextTrack()
	// playPreviousTrack()
	// playFirstTrack()
	// playLastTrack()
	// repeatTrack()
	// repeatPlaylist()

	audioKit.togglePlayback = function ( e ) {
		var target = $( 'li.selected' );
		var audio = target.find( 'audio' );
		var track = target.find( 'audio' )[ 0 ];
		var played = audio.hasClass( 'played' );
		var paused = track.paused;
		if ( target.any() ) {
			if ( played && paused ) {
				audioKit.startPlayback( target );
				interfaceKit.showAlert( 'Now Playing', target );
			} else if ( !played && paused ) {
				audioKit.stopPlayback();
				audioKit.startPlayback( target );
				interfaceKit.showAlert( 'Now Playing', target );
			} else if ( !track.paused ) {
				audioKit.pausePlayback( target );
				interfaceKit.showAlert( 'Paused', target );
			} else { /* unknown error */ }
		} else { audioKit.playFirstTrack(); }
	};

	audioKit.startPlayback = function ( target ) {
			target.find( 'audio' ).addClass( 'played' ).get( 0 ).play();
			interfaceKit.showAlert( 'Now Playing', target );
			initialisationKit.initialiseSeekbar();
			interfaceKit.showActivity( target );
			audioKit.regulatePlayback( target );
	};

	audioKit.stopPlayback = function ( e ) {
		var target = $( 'audio.played' );
		if ( target.any() ) {
			target.removeClass( 'played' );
			target[ 0 ].currentTime = 0;
			target[ 0 ].pause();
		} else { /* all tracks stopped */ }
	};
	
	audioKit.pausePlayback = function ( target ) {
		target.find( 'audio' )[ 0 ].pause();
	};
	
	audioKit.regulatePlayback = function ( target ) {
		var audio = target.find( 'audio.played' );
		audio.on( 'ended', function ( e ) {
			if ( !repeatSong && !repeatSongs ) {
				interfaceKit.showAlert( 'Playlist Ended', '' );
			} else if ( repeatSong && !repeatSongs ) {
				audioKit.repeatTrack();
			} else if ( repeatSong && repeatSongs ) {
				audioKit.playNextTrack();
			} else { /* unknown error */ }
		});
	};

	audioKit.playNextTrack = function ( e ) {
		var target = $( 'audio.played' ).closest( 'li.track' ).next();
		if ( target.any() ) {
			audioKit.stopPlayback();
			audioKit.startPlayback( target );
		} else {
			audioKit.stopPlayback();
			audioKit.repeatPlaylist();
		}
	};
	
	audioKit.playPreviousTrack = function ( e ) {
		var target = $( 'audio.played' ).closest( 'li.track' ).prev();
		if ( target.any() ) {
			audioKit.stopPlayback();
			audioKit.startPlayback( target );
		} else {
			audioKit.stopPlayback();
			audioKit.playFirstTrack();
		}
	};

	audioKit.playFirstTrack = function ( e ) {
		var target = $( 'li.track' ).first();
		audioKit.startPlayback( target );
	};

	audioKit.playLastTrack = function ( e ) {
		var target = $( 'li.track' ).last();
		audioKit.startPlayback( target );
	};
	
	audioKit.repeatTrack = function ( e ) {
		var target = $( 'audio.played' );
		var track = target.parent();
		target[ 0 ].currentTime = 0;
		audioKit.startPlayback( track );
	};
	
	audioKit.repeatPlaylist = function ( e ) {
		audioKit.playFirstTrack();
	};

	initialisationKit.initialiseTracks();
	interfaceKit.sortTracks( 'title', 'a-z' );
	initialisationKit.initialiseKeyEventAgent();
	initialisationKit.initialiseClickEventAgent();
	initialisationKit.initialiseDocumentObects();

});