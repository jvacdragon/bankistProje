"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelBalanceDate = document.querySelector('.balance__date');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions



//TIME OUT FUNCTION
//GLOBAL
let timer;

const tim = () => {
  let curr = new Date(0, 0, 0, 0, 2, 0);
  let date = '';

  const func = () => {
    curr = curr - 1000;
    date = new Date(curr).toLocaleTimeString('pt-PT', {
      minute: '2-digit',
      second: '2-digit',
    });
    labelTimer.textContent = `${date}`;

    if (date.toString() == '00:00') {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
  };

  func();
  const timer = setInterval(func, 1000);

  return timer;
};

const buttons = document.querySelectorAll('.form__btn');

buttons.forEach(btn => {
  btn.addEventListener('click', function () {
    if (timer) clearInterval(timer);
    timer = tim();
  });
});

//FUNCTION TO USE THE CORRECT VALUES
const intl = (lang, currency, val) => {
  const options = {
    style: 'currency',
    currency: currency,
  };
  return new Intl.NumberFormat(lang, options).format(val);
};

///////////////////////////// THE PART THAT I WROTE
////////////////////////////DISPLAY MOVEMENTS
//GLOBAL
let sort;

const displayMov = function mov(acc) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const movDate = new Date(acc.movementsDates[i]);
    const dateTime = new Intl.DateTimeFormat(acc.locale).format(movDate);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${dateTime}</div>

        <div class="movements__value">${intl(
          acc.locale,
          acc.currency,
          mov
        )}</div>
     </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//////////////////////////////////DISPLAY
//GLOBAL
let currValue;

const display = function display(acc) {
  displayMov(acc);

  currValue = acc.movements.reduce((cur, mov) => cur + mov);

  const now = new Date();
  const dateTime = new Intl.DateTimeFormat(acc.locale, {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  let currDate = new Date();


  labelWelcome.textContent = `Welcome back, ${currUser.split(' ')[0]}`;
  labelBalance.textContent = `${intl(acc.locale, acc.currency, currValue)}`;
  labelSumIn.textContent = `${sumIn(acc)}`;
  labelSumInterest.textContent = `${int(acc)}`;
  labelSumOut.textContent = `${sumOut(acc)}`;
  labelBalanceDate.textContent = `As of ${dateTime}`;
};

/////////////////////////////////SUM IN
const sumIn = function sumIn(acc) {
  const filtered = acc.movements.filter(mov => mov > 0);
  const sumIn = filtered.reduce((sum, curr) => sum + curr);
  return intl(acc.locale, acc.currency, sumIn);
};

/////////////////////////////////SUM OUT
const sumOut = function sumOut(acc) {
  if (acc.movements.find(mov => mov < 0) == undefined) {
    return intl(acc.locale, acc.currency, '0000');
  } else {
    const filtered = acc.movements.filter(mov => mov < 0);
    const sumOut = filtered.reduce((sum, curr) => sum + curr);
    const sum = intl(acc.locale, acc.currency, Math.abs(sumOut));
    return sum;
  }
};

//////////////////////////////INTEREST
const int = function int(acc) {
  const mov = acc.movements.filter(mov => mov > 0);
  const deposit = mov.map(deposit => (deposit * acc.interestRate) / 100);
  const int = deposit.filter(int => int >= 1);
  const interest = int.reduce((acc, inte) => acc + inte, 0);
  return intl(acc.locale, acc.currency, interest);
};

///////////////////////////LOGIN
//GLOBAL
let currUser;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  accounts.map(acc => {
    if (
      inputLoginUsername.value == acc.owner &&
      inputLoginPin.value == acc.pin
    ) {
      containerApp.style.opacity = 100;
      currUser = acc.owner;
      inputLoginUsername.value = inputLoginPin.value = '';

      display(acc);
      if (timer) clearInterval(timer);
      timer = tim();
    }
  });
});

////////////////////////////////CLOSE ACC
const close = function close() {
  accounts.forEach((acc, i) => {
    if (
      inputCloseUsername.value == acc.owner &&
      inputClosePin.value == acc.pin &&
      currUser == inputCloseUsername.value
    ) {
      accounts.splice(i, i);
      containerApp.style.opacity = 0;
    }
  });
};

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  close();
});

//////////////////////////////////LOAN REQUEST
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputLoanAmount.value > 0) {
    const acc = accounts.find(acc => acc.owner == currUser);
    acc.movements.push(Math.floor(+inputLoanAmount.value));
    acc.movementsDates.push(new Date());
    display(acc);
    inputLoanAmount.value = '';
  }
});

//////////////////////////////TRANSFER
//GLOBAL
let load = false;

function trf(acc) {
  if (inputTransferTo.value == acc.owner) {
    acc.movements.push(+inputTransferAmount.value);
    acc.movementsDates.push(new Date());
  }
  if (acc.owner == currUser) {
    acc.movements.push(+-inputTransferAmount.value);
    acc.movementsDates.push(new Date());
  }
}

function transfer() {
  accounts.map(acc => {
    if (inputTransferTo.value == acc.owner) load = true;
  });

  if (load == false || +currValue < inputTransferAmount.value) return;

  if (inputTransferTo.value == currUser) return;

  if (inputTransferAmount.value <= 0) return;

  accounts.forEach(trf);

  accounts.map(acc => {
    if (acc.owner == currUser) display(acc);
  });
}

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  transfer();
  inputTransferAmount.value = inputTransferTo.value = '';
});

///////////////////////SORT
btnSort.addEventListener('click', function () {
  sort = !sort;
  accounts.map(acc => {
    if (acc.owner == currUser) {
      displayMov(acc);
    }
  });
});