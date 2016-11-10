import SC from 'soundcloud';

SC.initialize({
    client_id: '4790864defb6a0d7eb3017d49a31b273',
    redirect_uri: window.location.protocol + '//rickyrombo.github.io/callback'
});

module.exports = SC;