const Order = require("./Order");

const OrderState = Object.freeze({
    NEWORDER: Symbol("newOrder"),
    WELCOMING: Symbol("welcoming"),
    SANDWICHSIZE: Symbol("sandwichsize"),
    SANDWICHBREAD: Symbol("sandwichbread"),
    SANDWICHTOPPINGS: Symbol("sandwichtoppings"),
    BURGERSIZE: Symbol("burgersize"),
    BURGERBREAD: Symbol("burgerbread"),
    BURGERTOPPINGS: Symbol("burgertoppings"),
    COMBO: Symbol("combo"),
    PAYMENT: Symbol("payment")
});


module.exports = class MamasOrder extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
        this.stateCur = OrderState.NEWORDER;
        this.sItem = "";
        this.sSize = "";
        this.sBread = "";
        this.sToppings = "";
        this.sCombo = "";
        this.sandwichRt = 3.99;
        this.burgerRt = 3;
    }

    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {
            case OrderState.NEWORDER:
                this.stateCur = OrderState.WELCOMING
                aReturn.push("Welcome to Mama's Kitchen,Our today's special are Sandwich and Burger. What would you like to order!");
                break;
            case OrderState.WELCOMING:
                if (sInput.toLowerCase() == 'sandwich') {
                    this.stateCur = OrderState.SANDWICHSIZE
                    this.sItem = 'Sandwich';
                    aReturn.push("What size of Sandwich would you like to order? Enter '6inch' for 6-inch or '12inch' for 12-inch");
                } else if (sInput.toLowerCase() == 'burger') {
                    this.stateCur = OrderState.BURGERSIZE
                    this.sItem = 'Burger';
                    aReturn.push("What size of Burger would you like to order? Enter '4oz' for 4-oz or '8oz' for 8-oz");
                } else {
                    aReturn.push("Sry, I didn't get you. Please enter the name of menu item to order.");
                }
                break;
            case OrderState.SANDWICHSIZE:
                if (sInput == '6inch') {
                    this.stateCur = OrderState.SANDWICHBREAD
                    this.sSize = '6-inch';
                    this.sandwichRt = this.sandwichRt + 1
                    aReturn.push("What type of bread would you like? Enter 'I' for Italian or 'H' for Italian Herbs and cheese?");
                } else if (sInput == '12inch') {
                    this.stateCur = OrderState.SANDWICHBREAD
                    this.sSize = '12-inch';
                    this.sandwichRt = this.sandwichRt + 2
                    aReturn.push("What type of bread would you like? Enter 'I' for Italian or 'H' for Italian Herbs and cheese?");
                } else {
                    aReturn.push("Sry, I didn't get you. Please enter size! 6inch/12inch?");
                }
                break;
            case OrderState.SANDWICHBREAD:
                if (sInput == "H") {
                    this.stateCur = OrderState.SANDWICHTOPPINGS
                    this.sBread = 'Italian Herbs and cheese';
                    this.sandwichRt = this.sandwichRt + 2
                    aReturn.push("What toppings would you like?");
                } else if (sInput == "I") {
                    this.stateCur = OrderState.SANDWICHTOPPINGS
                    this.sBread = 'Italian';
                    this.sandwichRt = this.sandwichRt + 1;
                    aReturn.push("What toppings would you like?");
                } else {
                    aReturn.push("Sry, I didn't get you. Please enter bread type! I/H?");
                }
                break;
            case OrderState.SANDWICHTOPPINGS:
                this.stateCur = OrderState.COMBO
                this.sToppings = sInput;
                this.nOrder = this.sandwichRt + 3
                aReturn.push("Would you like to make it a combo for extra $4.50?(yes/no) Combo comes with one drink and two Chocolate cookies!");
                break;
            case OrderState.BURGERSIZE:
                if (sInput == '4oz') {
                    this.stateCur = OrderState.BURGERBREAD
                    this.sSize = '4-oz';
                    this.burgerRt = this.burgerRt + 2;
                    aReturn.push("What type of bread would you like? Enter 'sesame' for Sesame bun or 'gluten' for Gluten Free bun");
                } else if (sInput == '8oz') {
                    this.stateCur = OrderState.BURGERBREAD
                    this.sSize = '8-oz';
                    this.burgerRt = this.burgerRt + 4;
                    aReturn.push("What type of bread would you like? Enter 'sesame' for Sesame bun or 'gluten' for Gluten Free bun");
                } else {
                    aReturn.push("Sry, I didn't get you. Please enter the burger size! 4oz/8oz?");
                }
                break;
            case OrderState.BURGERBREAD:
                if (sInput.toLowerCase() == "sesame") {
                    this.stateCur = OrderState.BURGERTOPPINGS
                    this.sBread = 'Sesame';
                    this.burgerRt = this.burgerRt + 1.50;
                    aReturn.push("What toppings would you like?");
                } else if (sInput == "gluten") {
                    this.stateCur = OrderState.BURGERTOPPINGS
                    this.sBread = 'Gluten free';
                    this.burgerRt = this.burgerRt + 2.50;
                    aReturn.push("What toppings would you like?");
                } else {
                    aReturn.push("Sry, I didn't get you. Please enter the bread type! sesame/gluten?");
                }
                break;
            case OrderState.BURGERTOPPINGS:
                this.stateCur = OrderState.COMBO
                this.sToppings = sInput;
                this.nOrder = this.burgerRt + 4;
                aReturn.push("Would you like to make it a combo for extra $4.50?(yes/no) Combo comes with one drink and Fries!");
                break;
            case OrderState.COMBO:
                this.stateCur = OrderState.PAYMENT;
                if (sInput.toLowerCase() == "yes") {
                    this.nOrder = this.nOrder + 4.50;
                }
                this.sCombo = sInput;
                aReturn.push(`Thank-you for your order of ${this.sSize} ${this.sItem} with ${this.sBread} bread. Your choice for toppings are: ${this.sToppings}`);
                if (this.sCombo.toLowerCase() == "yes") {
                    aReturn.push(`Added combo to to your meal as per your request.`);
                }
                aReturn.push(`Subtotal: CA$${this.nOrder}`);
                aReturn.push(`Taxes: CA$${(this.nOrder * 0.13).toFixed(2)}`); // tax
                this.nOrder = (this.nOrder + (this.nOrder * 0.13)).toFixed(2); // total amount after tax
                aReturn.push(`Total: $${this.nOrder}`);
                aReturn.push(`Please pay for your order here: ${this.sUrl}/payment/${this.sNumber}/`);
                break;
            case OrderState.PAYMENT:
                this.isDone(true);
                let d = new Date();
                d.setMinutes(d.getMinutes() + 20);
                aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
                break;
        }
        return aReturn;
    }

    renderForm() {
        // your client id should be kept private
        const sClientID = process.env.SB_CLIENT_ID
        return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        <link rel="stylesheet" type="text/css" href="/static/paypal.css"/>
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        <div class="center">
        <p>Thank you for your order of $${this.nOrder}.</p>
        <p>Your order id is <b> ${this.sNumber} </b>. Please show this number to the restaurant to collect your food.</p>
        <div id="paypal-button-container"></div>
        </div>
        <script>
          paypal.Buttons({
            style: {
              layout: 'vertical',
              color:  'blue',
              shape:  'pill',
              label:  'buynow'
            },
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });

              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              },
              
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

    }
}