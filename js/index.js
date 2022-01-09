/* eslint-disable no-undef */
$(document).ready(function () {
    const $body = $('body');
    $.get('/components/header.html', data => {$body.append(data); $body.append(data)})
});
