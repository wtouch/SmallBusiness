jQuery(function ($) {

            $.supersized({

                // Functionality
                slide_interval: 3000,		// Length between transitions
                transition: 1, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
                transition_speed: 700,		// Speed of transition

                // Components							
                slide_links: 'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
                slides: [			// Slideshow Images
							{ image: 'img/slider/pic (1).jpg', url: '' },
							{ image: 'img/slider/pic (2).jpg', url: '' },
							{ image: 'img/slider/pic (3).jpg', url: '' },
                ]

            });
        });