export class ProfileFakeDb
{
    public static timeline = {
        activities: [
            {
                'user'   : {
                    'name'  : 'Nella Cocci',
                    'avatar': 'assets/images/avatars/alice.jpg'
                },
                'message': 'ha realizzato 1400 p.ti',
                'time'   : '13 minuti fa'
            },
            {
                'user'   : {
                    'name'  : 'Guglielmo Siciliani',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message': 'si è iscritto al laboratorio',
                'time'   : '3 ore fa'
            },
            {
                'user'   : {
                    'name'  : 'Claudio Castiglione',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message': 'ha condiviso un documento',
                'time'   : '9 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Viviano Lori',
                    'avatar': 'assets/images/avatars/carl.jpg'
                },
                'message': 'ha realizzato 1734 p.ti',
                'time'   : '6 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Antonina Trevisan',
                    'avatar': 'assets/images/avatars/jane.jpg'
                },
                'message': 'ha commentato il post',
                'time'   : '6 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Luca Padovesi',
                    'avatar': 'assets/images/avatars/james.jpg'
                },
                'message': 'ha fatto 800 p.ti',
                'time'   : '1 Novembre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Antonella Siciliano',
                    'avatar': 'assets/images/avatars/joyce.jpg'
                },
                'message': 'ha condiviso un documento',
                'time'   : '21 Ottobre, 2017'
            },
            {
                'user'   : {
                    'name'  : 'Andrea Trentini',
                    'avatar': 'assets/images/avatars/vincent.jpg'
                },
                'message': 'ha commentato un post',
                'time'   : '15 Ottobre, 2017'
            }
        ],
        posts     : [
            {
                'user'    : {
                    'name'  : 'Claudio Castiglione',
                    'avatar': 'assets/images/avatars/garry.jpg'
                },
                'message' : 'Ciao a tutti, stiamo organizzando un nuovo Laboratorio. Il tema sar',
                'time'    : '32 minutes ago',
                'type'    : 'post',
                'like'    : 5,
                'share'   : 21,
                'media'   : {
                    'type'   : 'image',
                    'preview': 'assets/images/etc/early-sunrise.jpg'
                },
                'comments': [
                    {
                        'user'   : {
                            'name'  : 'Nella Cocci',
                            'avatar': 'assets/images/avatars/alice.jpg'
                        },
                        'time'   : 'June 10, 2015',
                        'message': 'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.'
                    }
                ]
            },
            {
                'user'    : {
                    'name'  : 'Guglielmo Siciliani',
                    'avatar': 'assets/images/avatars/andrew.jpg'
                },
                'message' : 'Hey, man! Check this, it’s pretty awesome!',
                'time'    : 'June 12, 2015',
                'type'    : 'article',
                'like'    : 98,
                'share'   : 6,
                'article' : {
                    'title'   : 'The Fallout 4 Pip-Boy Edition Is Back In Stock Now',
                    'subtitle': 'Kotaku',
                    'excerpt' : 'The Fallout 4 Pip-Boy edition is back in stock at Gamestop, for all 3 platforms. Additionally, Walmart also has it in stock for the PS4 and Xbox One as of this writing, as does Best Buy.',
                    'media'   : {
                        'type'   : 'image',
                        'preview': 'assets/images/etc/fallout.jpg'
                    }
                },
                'comments': [
                    {
                        'user'   : {
                            'name'  : 'Nella Cocci',
                            'avatar': 'assets/images/avatars/alice.jpg'
                        },
                        'time'   : 'June 10, 2015',
                        'message': 'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.'
                    }
                ]
            },
            {
                'user'   : {
                    'name'  : 'Viviano Lori',
                    'avatar': 'assets/images/avatars/carl.jpg'
                },
                'message': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...',
                'time'   : 'June 10, 2015',
                'type'   : 'something',
                'like'   : 4,
                'share'  : 1
            }
        ]
    };

    public static photosVideos = [
        {
            'name' : 'June 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'May 2015',
            'info' : '7 Photos, 3 Videos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                }
            ]
        },
        {
            'name' : 'April 2015',
            'info' : '5 Photos',
            'media': [
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Hot air balloons',
                    'preview': 'assets/images/etc/air-balloons.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Cactus',
                    'preview': 'assets/images/etc/cactus.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Road Trip',
                    'preview': 'assets/images/etc/road-trip.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Sunset',
                    'preview': 'assets/images/etc/mountain-sunset.jpg'
                },
                {
                    'type'   : 'photo',
                    'title'  : 'Mountain Lake',
                    'preview': 'assets/images/etc/mountain-lake.jpg'
                }
            ]
        }
    ];

    public static about = {
        'general': {
            'gender'   : 'Female',
            'birthday' : 'May 8th, 1988',
            'locations': [
                'Istanbul, Turkey',
                'New York, USA'
            ],
            'about'    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget pharetra felis, sed ullamcorper dui. Sed et elementum neque. Vestibulum pellente viverra ultrices. Etiam justo augue, vehicula ac gravida a, interdum sit amet nisl. Integer vitae nisi id nibh dictum mollis in vitae tortor.'
        },
        'work'   : {
            'occupation': 'Developer',
            'skills'    : 'C#, PHP, Javascript, Angular, JS, HTML, CSS',
            'jobs'      : [
                {
                    'company': 'Self-Employed',
                    'date'   : '2010 - Now'
                },
                {
                    'company': 'Google',
                    'date'   : '2008 - 2010'
                }
            ]
        },
        'contact': {
            'address' : 'Ut pharetra luctus est quis sodales. Duis nisi tortor, bibendum eget tincidunt, aliquam ac elit. Mauris nec euismod odio.',
            'tel'     : [
                '+6 555 6600',
                '+9 555 5255'
            ],
            'websites': [
                'withinpixels.com'
            ],
            'emails'  : [
                'mail@withinpixels.com',
                'mail@creapond.com'
            ]
        },
        'groups' : [
            {
                'logo'    : 'assets/images/logos/android.png',
                'name'    : 'Android',
                'category': 'Technology',
                'members' : '1.856.546'
            },
            {
                'logo'    : 'assets/images/logos/google.png',
                'name'    : 'Google',
                'category': 'Web',
                'members' : '1.226.121'
            },
            {
                'logo'    : 'assets/images/logos/fallout.png',
                'name'    : 'Fallout',
                'category': 'Games',
                'members' : '526.142'
            }
        ],
        'friends': [
            {
                'name'  : 'Garry Newman',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Carl Henderson',
                'avatar': 'assets/images/avatars/carl.jpg'
            },
            {
                'name'  : 'Jane Dean',
                'avatar': 'assets/images/avatars/jane.jpg'
            },
            {
                'name'  : 'Garry Arnold',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            {
                'name'  : 'Vincent Munoz',
                'avatar': 'assets/images/avatars/vincent.jpg'
            },
            {
                'name'  : 'Alice Freeman',
                'avatar': 'assets/images/avatars/alice.jpg'
            },
            {
                'name'  : 'Andrew Green',
                'avatar': 'assets/images/avatars/andrew.jpg'
            }
        ]
    };
}
