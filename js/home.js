var money = 0;
var itemForPurchase;

$(document).ready(function () {
    loadItems();
})

function getCardColor(){
  var colors = [ "#67CDD3", "#FEB24F", "#E5493C", "#CFBEB0", "#9ECF8B" ];
  var random = Math.floor(Math.random() * 5);
  return colors[random];
}

function loadItems(){
  clearItems();
  var vendingItems = $('#vendingItems');
  $.ajax ({
    type: 'GET',
    url: 'https://tsg-vending.herokuapp.com/items',
    success: function (data, status) {
        $.each(data, function(index, item) {

          var card = '<div class = "col-md-4 col-sm-6">';
          card += '<div class = "card btn" style = "margin: 10px; background-color: '+getCardColor()+'" onclick = "enterItem('+ item.id +')">';
          card += '<p style = "text-align: left; padding: 0 0 5px 0; margin: 0">'+item.id+'</p>';
          card += '<p id = "itemName">'+item.name+'</p>';
          card += '<br>';
          card += '<p>$'+item.price+'</p>';
          card += '<p>Quantity Left: '+item.quantity+'</p>';
          card += '</div></div>';
          vendingItems.append(card);
        });
      },
      error: function () {
        $('#message').text('Error loading machine.');
      }
  });
}

function addMoney(newMoney) {
  money+=newMoney;
  $('#moneyIn').text(money/100);
}

function clearItems() {
  $('#vendingItems').empty();
}

function enterItem(itemId) {
  itemForPurchase = itemId;
  $('#selectedItem').text(itemForPurchase);
}

$("#returnChangeButton").click(function() {
  $('#message').html('-');
  var quarters = Math.floor(money/25);
  var remainder = money%25;
  var dimes = Math.floor(remainder/10);
  var remainder = remainder%10;
  var nickels = Math.floor(remainder/5);
  var remainder = remainder%5;
  var pennies = remainder;
  $('#change').text(quarters + ' Quarters, ' + dimes + ' Dimes, ' + nickels + ' Nickels, ' + pennies + ' Pennies');
  $('#moneyIn').html('0');
  money = 0;
})

$('#purchaseButton').click(function() {

  if (itemForPurchase == null) {
    $('#message').text('SELECT AN ITEM');
  } else {
    purchaseMoney = money/100;
    $.ajax({
      type: 'GET',
      url: 'https://tsg-vending.herokuapp.com/money/' + purchaseMoney + '/item/' + itemForPurchase,
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      success: function(data, status) {
        $('#message').text('Thank You!!!');
        money = 0;
        $('#change').text(data.quarters + ' Quarters, ' + data.dimes + ' Dimes, ' + data.nickels + ' Nickels, ' + data.pennies + ' Pennies');
        $('#moneyIn').html('0');
        loadItems();
      },
      error: function (xhr, status, error) {
        $('#message').empty();
        $('#message').text(xhr.responseJSON.message);
     }
   });
  }
})
