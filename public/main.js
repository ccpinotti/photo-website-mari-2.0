
$().ready( function() {

  const handleQuoteDelete = function(event){
    const element = $(event.target);
    const quoteId = element.attr('data-id');
    fetch('quotes', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'id': quoteId })
    })
    .then(res => {
      if (res.ok) return res.json()
    }).
    then(data => {
      console.log(data)
      window.location.reload()
    })
  };

  $('.deleteQuoteButton').click(handleQuoteDelete);
});
