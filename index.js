$(() => {
  // Grab the main content area of the page
  const $page = $('#all-contents');

  // Make the parent a flexbox row so children line up horizontally
  $page.css({
    display: 'flex',
    'align-items': 'flex-start'
  });

  // Render a container where tweets will go
  const $tweetsDiv = $('<div class="tweets"></div>');

  // Render a button to display new tweets
  const $button = $('<button id="new-tweets-button">').text("New Toot");

  // Create input fields for username, message, and a submit button for tweeting
  const $usernameInput = $('<input id="username-input" placeholder="Username">');
  const $messageInput = $('<input id="message-input" placeholder="What\'s happening?">');
  const $submitButton = $('<input type="submit" value="Toot Your Horn!">');

  // Add button and input fields to tweets container (keeps UI together)
  $tweetsDiv.append($button, $usernameInput, $messageInput, $submitButton);

  // Create and style the image
  const $img = $('<img>')
    .attr('src', 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/cat-playing-saxophone-cool-wind-instrument-sax-gift-lotus-leafal.jpg')
    .attr('alt', 'Cat playing saxophone')
    .css({
      width: '1100px',
      'margin-left': '8px',
      'border-radius': '8px'
    });

  // Append both the tweets and image to the page, as siblings
  $page.append($tweetsDiv, $img);

  // Grab all the current tweets from streams.home in data-generator.js
  const $tweetsData = streams.home;

  // Define a function that renders tweets from a given array
  let newTweets = function (array) {
    // Reverse the array to display newest tweets at the top, then map to DOM elements
    const $tweetElements = array.slice().reverse().map((tweet) => {
      // Create a container div for the tweet
      const $tweet = $('<div class="tweet"></div>');

      // Create a username tag and message tag for the tweet
      const userNameTag = $('<div>')
        .addClass('username')
        .text(tweet.user);

      const userMessage = $('<div>')
        .text(tweet.message)
        .addClass('message');

      // When you click on a username, show only their tweets
      userNameTag.on('click', (event) => {
        newTweets(streams.users[tweet.user]);
      });

      // Add the username and message to the tweet box
      $tweet.append(userNameTag);
      $tweet.append(userMessage);

      // Add full timestamp (required by test)
      const $timestamp = $('<div></div>')
        .addClass('timestamp')
        .text(moment(tweet.created_at).format('MMMM Do YYYY, h:mm:ss a'));
      $tweet.append($timestamp);

      // Add human-friendly timestamp
      const $timeSince = $('<div></div>')
        .addClass('humanFriendlyTimestamp')
        .text(moment(tweet.created_at).fromNow());
      $tweet.append($timeSince);

      return $tweet;
    });

    // Clear old tweets and append the new ones in correct order
    // Also, remove any previously rendered tweets (but not the button/inputs)
    $tweetsDiv.find('.tweet').remove();
    $tweetsDiv.append($tweetElements);

    // Style each tweet box after they are added to the DOM!
    $('.tweet').css({
      'background': 'purple',
      'color': 'white',
      'margin': '10px 0',
      'padding': '12px',
      'border-radius': '12px',
      'width': '100%',
      'box-sizing': 'border-box'
    });

    // Style the tweets container so it doesn't fill the whole page
    $tweetsDiv.css({
      'width': '400px',
      'max-width': '95vw',
      'margin': '24px 0',
      'background': 'rgba(0,0,0,0.3)',
      'border-radius': '18px',
      'padding': '16px',
      'box-sizing': 'border-box'
    });
  };

  // Show all tweets when the page first loads
  newTweets(streams.home);

  // Button event handler for loading new tweets
  $button.on('click', () => {
    newTweets(streams.home);
  });

  // Submit button event handler for adding new tweets
  $submitButton.on('click', function(event) {
    event.preventDefault();

    const username = $usernameInput.val();
    const message = $messageInput.val();

    if (username && message) {
      const prevUser = window.visitor;

      if (!streams.users[username]) {
        streams.users[username] = [];
      }

      window.visitor = username;
      if (typeof writeTweet === 'function') {
        writeTweet(message);
      } else {
        const newTweet = {
          user: username,
          message: message,
          created_at: new Date()
        };
        streams.users[username].push(newTweet);
        streams.home.push(newTweet);
      }
      if (prevUser !== undefined) {
        window.visitor = prevUser;
      }

      $usernameInput.val('');
      $messageInput.val('');

      newTweets(streams.home);
    }
  });

  // Style the new tweet button (optional, style as you like)
  $button
    .css('color', 'purple')
    .css('font-family', '"Century Gothic", Arial, sans-serif')
    .css('font-style', 'italic')
    .css('background-color', 'beige')
    .css('font-weight', 'bold');
});
