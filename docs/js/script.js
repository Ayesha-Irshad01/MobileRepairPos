$(document).ready(function() {
    // Mobile Sidebar Toggle
    $('#sidebarToggle').click(function() {
        $('#sidebar').toggleClass('-translate-x-full');
    });

    $('#closeSidebar').click(function() {
        $('#sidebar').addClass('-translate-x-full');
    });

    // Dark Mode Toggle
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        $('body').addClass('dark-mode');
        $('#theme-toggle-dark-icon').addClass('hidden');
        $('#theme-toggle-light-icon').removeClass('hidden');
    }

    $('#theme-toggle').click(function() {
        $('body').toggleClass('dark-mode');
        $('#theme-toggle-dark-icon').toggleClass('hidden');
        $('#theme-toggle-light-icon').toggleClass('hidden');
        
        let theme = 'light';
        if ($('body').hasClass('dark-mode')) {
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
    });

    // Search functionality
    $('#searchInput').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('.searchable-content').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    // Image Zoom functionality
    $('.zoomable-img').click(function() {
        $(this).toggleClass('zoomed');
    });

    // Close zoom when clicking outside
    $(window).click(function(e) {
        if (!$(e.target).hasClass('zoomable-img')) {
            $('.zoomable-img').removeClass('zoomed');
        }
    });
});
