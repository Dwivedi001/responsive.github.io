// NOTICE: This pen may appear to not work on mobile devices, but it is  due to the codepen footer and the browser's bottom menu bar that hide the button. It should work fine when implemented for your website

// used to avoid using 255, thus generating white-ish backgrounds that make text unreadable

jQuery(document).ready(function($) {
    //update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
    var MqM = 768,
        MqL = 1024;

    var faqsSections = $('.cd-faq-group'),
        faqTrigger = $('.cd-faq-trigger'),
        faqsContainer = $('.cd-faq-items'),
        faqsCategoriesContainer = $('.cd-faq-categories'),
        faqsCategories = faqsCategoriesContainer.find('a'),
        closeFaqsContainer = $('.cd-close-panel');

    //select a faq section 
    faqsCategories.on('click', function(event) {
        event.preventDefault();
        var selectedHref = $(this).attr('href'),
            target = $(selectedHref);
        if ($(window).width() < MqM) {
            faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
            closeFaqsContainer.addClass('move-left');
            $('body').addClass('cd-overlay');
        } else {
            $('body,html').animate({ 'scrollTop': target.offset().top - 20 }, 400);
        }
    });

    //close faq lateral panel - mobile only
    $('body').bind('click touchstart', function(event) {
        if ($(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) {
            closePanel(event);
        }
    });
    faqsContainer.on('swiperight', function(event) {
        closePanel(event);
    });

    //show faq content clicking on faqTrigger
    faqTrigger.on('click', function(event) {
        event.preventDefault();
        $(this).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
    });

    //update category sidebar while scrolling
    $(window).on('scroll', function() {
        if ($(window).width() > MqL) {
            (!window.requestAnimationFrame) ? updateCategory(): window.requestAnimationFrame(updateCategory);
        }
    });

    $(window).on('resize', function() {
        if ($(window).width() <= MqL) {
            faqsCategoriesContainer.removeClass('is-fixed').css({
                '-moz-transform': 'translateY(0)',
                '-webkit-transform': 'translateY(0)',
                '-ms-transform': 'translateY(0)',
                '-o-transform': 'translateY(0)',
                'transform': 'translateY(0)',
            });
        }
        if (faqsCategoriesContainer.hasClass('is-fixed')) {
            faqsCategoriesContainer.css({
                'left': faqsContainer.offset().left,
            });
        }
    });

    function closePanel(e) {
        e.preventDefault();
        faqsContainer.removeClass('slide-in').find('li').show();
        closeFaqsContainer.removeClass('move-left');
        $('body').removeClass('cd-overlay');
    }

    function updateCategory() {
        updateCategoryPosition();
        updateSelectedCategory();
    }

    function updateCategoryPosition() {
        var top = $('.cd-faq').offset().top,
            height = jQuery('.cd-faq').height() - jQuery('.cd-faq-categories').height(),
            margin = 20;
        if (top - margin <= $(window).scrollTop() && top - margin + height > $(window).scrollTop()) {
            var leftValue = faqsCategoriesContainer.offset().left,
                widthValue = faqsCategoriesContainer.width();
            faqsCategoriesContainer.addClass('is-fixed').css({
                'left': leftValue,
                'top': margin,
                '-moz-transform': 'translateZ(0)',
                '-webkit-transform': 'translateZ(0)',
                '-ms-transform': 'translateZ(0)',
                '-o-transform': 'translateZ(0)',
                'transform': 'translateZ(0)',
            });
        } else if (top - margin + height <= $(window).scrollTop()) {
            var delta = top - margin + height - $(window).scrollTop();
            faqsCategoriesContainer.css({
                '-moz-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-webkit-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-ms-transform': 'translateZ(0) translateY(' + delta + 'px)',
                '-o-transform': 'translateZ(0) translateY(' + delta + 'px)',
                'transform': 'translateZ(0) translateY(' + delta + 'px)',
            });
        } else {
            faqsCategoriesContainer.removeClass('is-fixed').css({
                'left': 0,
                'top': 0,
            });
        }
    }

    function updateSelectedCategory() {
        faqsSections.each(function() {
            var actual = $(this),
                margin = parseInt($('.cd-faq-title').eq(1).css('marginTop').replace('px', '')),
                activeCategory = $('.cd-faq-categories a[href="#' + actual.attr('id') + '"]'),
                topSection = (activeCategory.parent('li').is(':first-child')) ? 0 : Math.round(actual.offset().top);

            if ((topSection - 20 <= $(window).scrollTop()) && (Math.round(actual.offset().top) + actual.height() + margin - 20 > $(window).scrollTop())) {
                activeCategory.addClass('selected');
            } else {
                activeCategory.removeClass('selected');
            }
        });
    }
});
const colorMax = 192;

// gets the breakpoint at which the scroll-to-top button should appear
const scrollBreakpoint = window.innerHeight * 0.9;

document.addEventListener('DOMContentLoaded', () => {
    randomizeBackgrounds();
    setupScrollListener();
    setupScrollEvent();
});

// scrolls window to top
function setupScrollEvent() {
    const scrollButton = document.querySelector('.scroll-top');

    scrollButton.addEventListener('click', (e) => {
        // not the best solution until Safari/Edge support scroll behavior
        // window.scrollTo({ top: 0, behavior: 'smooth' });

        // Thanks to Geroge Daniel https://stackoverflow.com/questions/51229742/javascript-window-scroll-behavior-smooth-not-working-in-safari
        smoothVerticalScrolling(scrollButton.parentElement, 250, "top");
    });
}

// prepares the window for a scroll event to show the scroll button
function setupScrollListener() {
    window.addEventListener('scroll', (e) => {
        const scrollButton = document.querySelector('.scroll-top');

        // const scrollOffset = document.scrollingElement.scrollTop;
        const scrollOffset = window.scrollY;

        if (scrollOffset >= scrollBreakpoint) {
            scrollButton.classList.add('visible');
        } else if (scrollOffset <= 0) {
            scrollButton.classList.remove('visible');
        }
    });
}

function randomizeBackgrounds() {
    // get all the content containers
    const contentContainers = document.querySelectorAll('.content-container');

    [].forEach.call(contentContainers, container => {
        // assign random background
        container.style.background = `rgb(${randVal(colorMax)},${randVal(colorMax)},${randVal(colorMax)})`;
    });
}

// random between 0 to max
function randVal(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// uses a timeout to scroll to top
function smoothVerticalScrolling(e, time, where) {
    // gets the element's top position relative to the viewport
    const eTop = e.getBoundingClientRect().top;

    // divides the top offset into 100 steps to be ellapsed
    const eAmt = eTop / 100;

    // starting time
    let curTime = 0;

    // not to exceed the desired duration
    while (curTime <= time) {
        // call a function to execute at one hundreth of the desired scroll time
        window.setTimeout(SVS_B, curTime, eAmt, where);
        // increase by one hundreth of the desired time to execute exactly 100 times
        curTime += time / 100;
    }
}

function SVS_B(eAmt, where) {
    // scroll by half the hundredth of the top offset if destination is not top (since to center only involves scrolling either in the top or bottom half of the window)
    if (where == "center" || where == "") {
        window.scrollBy(0, eAmt / 2);
    }
    // otherwise scroll the full amount
    if (where == "top") {
        window.scrollBy(0, eAmt);
    }
}