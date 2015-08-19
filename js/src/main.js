$(function () {
    'use strict';

    if (window.ATOS === undefined) { window.ATOS = {}; }

    $.support.placeholder = (function(){
        var i = document.createElement('input');
        return 'placeholder' in i;
    })();

    (function (ATOS, $) {

        ATOS.Accordion = function(context) {

            this._accordion = $(context);
            this.init();

        };

        ATOS.Accordion.prototype.init = function () {

            this._accordion.on('click', 'li', function() {

                $(this).siblings().removeClass('active');
                $(this).toggleClass('active');

            });

        };

        ATOS.projectForm = {

            videoId: null,

            init: function() {
                var self = this;
                
                if ($('.teammembers').length) {
                    self.orderTeammembers();
                }

                // add member
                $('.teammembers').on('click', '.teammember_add', function(e) {
                    self.addTeammember();
                    self.orderTeammembers();
                    e.preventDefault();
                });

                // remove member
                $('.teammembers').on('click', '.teammember_remove', function(e) {
                    self.removeTeammember($(this).parent('.teammember'));
                    self.orderTeammembers();
                    e.preventDefault();
                });

                // video
                if ($('#video_id').length) {
                    self.initVideo($('#video_url').val());
                }

                $('#video_url').on('keyup', function() {
                    self.initVideo($(this).val());
                });

                // max words
                $('*[data-max-words]').each(function() {
                    var id = '#'+$(this).attr('id');
                    var data = $(this).attr('data-max-words');
                
                    $(id).simplyCountable({
                        counter:            id+'_count',
                        countType:          'words',
                        maxCount:           parseFloat(data),
                        strictMax:          true,
                        countDirection:     'up'
                    });
                });
                
                // my university
                if ($('#university-not-listed').is(':checked')) {
                    self.toggleMyUniversity();
                }
                
                $('#universities').on('change', function() {
                    self.toggleMyUniversity();
                });
                
                $('#show-my-university').on('click', function(e) {
                    self.showMyUniversity();
                    e.preventDefault();
                });
            },
            
            toggleMyUniversity: function() {
                var self = this;
                
                if ($('#university-not-listed').is(':checked')) {
                    self.showMyUniversity();
                } else {
                    self.hideMyUniversity();
                }
            },
            
            showMyUniversity: function() {
                $('#universities option:selected').prop('selected', false);
                $('#university-not-listed').prop('selected', true);
                $('#my-university').show();
            },
            
            hideMyUniversity: function() {
                $('#my-university').hide();
            },

            addTeammember: function() {

                var $member = $('.teammember:first');
                var $clone = $member.clone(true).hide();
                // reset values for all input elements
                $clone.find('input, select, textarea').val('');
                // remove errors
                $clone.find('.message').remove();
                $clone.find('li.error').removeClass('error');
                // unchecked all radio boxes because their names are not yet updated
                $clone.find(':radio').prop('checked', false);
                // ready, set, add
                $clone.appendTo('.teammembers').fadeIn();
            },

            removeTeammember: function($member) {

                $member.remove();
            },

            orderTeammembers: function() {

                var $member = $('.teammember');

                $member.each(function() {
                    var index = $(this).index();

                    // update the header title with the member index
                    var $header = $(this).find('.header');
                    var header_text = $header.text().replace(new RegExp("Teammember \\d", "g"), "Teammember "+(index+2)+"");
                    $header.text(header_text);

                    // update the name for all input elements with the member index
                    $(this).find('input, select, textarea').each(function() {
                        var name = $(this).attr('name');
                        name = name.replace(new RegExp("member\\[\\d\\]", "g"), "member["+(index+1)+"]");
                        $(this).attr('name', name);
                    });

                    // hide the add button
                    $(this).find('.teammember_add').hide();
                    
                    // show the remove button for all except the first member
                    if (index > 0) {
                        $(this).find('.teammember_remove').show();
                    }
                });

                // hide the remove button when we only have 1 member
                if ($member.length === 1) {
                    $member.find('.teammember_remove').hide();
                }

                if ($member.length < 4) {
                    // only the the add button with the last member
                    $member.filter(':last').find('.teammember_add').show();
                }
                
                // Loop through all radio button groups and check is none is checked
                var radio_groups = {}
                $(':radio').each(function(){
                    var name = $(this).attr('name');
                    name = name.replace(/(:|\.|\[|\])/g,'\\$1'); 
                    radio_groups[name] = true;
                });
                
                $.each(radio_groups, function(index, value) {
                    var if_checked = !!$(":radio[name="+index+"]:checked").length;
                    
                    if (!if_checked) {
                        $(":radio[name="+index+"]:first").prop('checked', true);
                    }
                });
            },

            initVideo: function(url) {
                var self = this;

                var id = self.youTubeUrlCheck(url);
                self.videoId = id;

                if (id && !self.checkVideo()) {
                    self.addVideo();
                } else {
                    self.destroyVideo();
                }
            },

            youTubeUrlCheck: function(url) {
                var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                return (url.match(p)) ? RegExp.$1 : false ;
            },

            checkVideo: function() {
                var self = this;
                var error = false;

                $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+self.videoId+'?v=2&alt=jsonc', function(data) {
                    if (data.error) {
                        error = true;
                    }
                });

                return (error);
            },

            addVideo: function() {
                var self = this;

                var $iframe = $('<iframe />', {
                    src: 'http://www.youtube.com/embed/'+self.videoId,
                });

                $('#video_id').val(self.videoId);
                $('#video_message').hide();
                $('#player').html($iframe).show();
            },

            destroyVideo: function() {
                self.videoId = null;
                $('#video_id').val('');
                $('#video_message').show();
                $('#player').hide();
                $('#player iframe').remove();
            }
        };

        ATOS.Placeholders = {

            init: function() {

            	var inputs = $('input[type=text], input[type=email], textarea').filter(function() {
            	   return $(this).val() === '';
            	});

            	inputs
            		.each(function(i) {
            			var $t = $(this);
            			$t.addClass('placeholder');
            			$t.val($t.attr("placeholder"));
            		})
            		.focus(function() {
            			var $t = $(this);
            			if ($t.val() === $t.attr("placeholder")) {
                            $t.removeClass('placeholder');
                            $t.val('');
                        }
            		})
            		.blur(function() {
            			var $t = $(this);
            			if($t.val() === '') {
                            $t.addClass('placeholder');
            				$t.val($t.attr("placeholder"));
            			}
            		});

            }

        };

    }(window.ATOS, jQuery));

    $('.accordion').each(function () {
        new window.ATOS.Accordion($(this));
    });

    if ($('#join-form').length) {
        window.ATOS.projectForm.init();
    }

    if (!$.support.placeholder) window.ATOS.Placeholders.init();


    /* Menu */

    var $menu = $('#menu'),
        $menulink = $('.menu-toggle'),
        $wrap = $('#page-wrapper');

    $menulink.on('click', function() {
        $menulink.toggleClass('active');
        $wrap.toggleClass('active');
        return false;
    });

    /* Carousel */

	if ($('#carousel').length && $('.carousel-visuals-wrapper').length > 1) {
		$('.carousel-visuals-wrapper:gt(0)').hide();
		setInterval(function(){
			$('.carousel-visuals-wrapper:first-child').fadeOut(1000).next('.carousel-visuals-wrapper').fadeIn(1000)
			.end().appendTo('#carousel-visuals');
		}, 5000);
	}

    /* Flip counter */

	if ($('#flippers').length) {
	
        var date = $('#flippers').attr('data-date');
        var then = new Date(date).getTime();
        var now = new Date().getTime();

        var d1 = $.Deferred();
        var d2 = $.Deferred();

        var j1 =
	       $.ajax({
                url: 'http://www.timeapi.org/utc/in+1+hour.json',
                dataType: 'jsonp',
                timeout : 5000,
                jsonp: 'callback',
                success: function(json) {
                    now = new Date(json.dateString).getTime();
                },
                complete: function() {
                    d1.resolve();
                }
            });

        var j2 =
            $.ajax({
                url: 'http://www.timeapi.org/utc/'+date.replace(' ', '+')+'.json',
                dataType: 'jsonp',
                timeout : 5000,
                jsonp: 'callback',
                success: function(json) {
                    then = new Date(json.dateString).getTime();
                },
                complete: function() {
                    d2.resolve();
                }
            });

        $.when(d1, d2).done(function() {
            var a = moment(then);
            var b = moment(now);
            var days = a.diff(b, 'days');
            var digits = days.toString().split('');
            
            var html = '';
            $.each(digits, function(name, value) {
                html += '<span class="flip">'+value+'</span>';
            });
            
            $('#flippers').html(html);
        });
    }
    
    /* Project photo popup */

    $('.project-photos').magnificPopup({
        delegate: 'a',
        type: 'image',
        gallery: {
            enabled:true
        }
    });

});
