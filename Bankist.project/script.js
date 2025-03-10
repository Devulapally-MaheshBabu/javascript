const account1 = {
    owner: 'Mahesh Babu Devulapally',
    movements: [200, 455, -306, 25000, -642, -133, 79, 1300],
    interestRate: 1.2, // %
    pin: 1111,
}
const account2 = {
    owner: 'Manasa Devulapally',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
}
const account3 ={
    owner:'Blaraju Devulapally',
    movements:[200,-200,340,-300,-20,50,400,-460],
    interestRate:0.7,
    pin:3333,
}
const accounts = [account1, account2,account3];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
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

 const displayMovement =function (movements,sort=false){
    containerMovements.innerHTML=' '
    const movs=sort ? movements.slice().sort((a,b)=> a - b) :movements
 movs.forEach(function(mov,i){
    const type =mov>0 ?'deposit':'withdrawal' 

    const html=`
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type} </div>
          <div class="movements__value">₹ ${mov}</div>
        </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin',html)
 })
}
const calcDisplySummary=function(total){
    const income=total.movements.filter(mov => mov>0).reduce((acc,mov)=>acc+mov,0)
    labelSumIn.textContent=`₹ ${income}`
    const outgoing=total.movements.filter(mov => mov<0).reduce((acc,mov)=>acc+mov,0)
    labelSumOut.textContent=` ₹ ${Math.abs(outgoing)}`
    const intrest=total.movements
    .filter(mov=> mov>0)
    .map(depsote=> (depsote*total.interestRate)/100)
    .reduce((acc,int)=>acc+int,0)
    labelSumInterest.textContent=`₹ ${intrest}`
}
const createUsername=function(accs){
    accs.forEach(function(acc){
acc.username=acc.owner.toLowerCase().split(' ').map(
    function(name){
        return name[0]
    }).join('')
   })
} 
createUsername(accounts)
const updateUi=function(acc){
    displayMovement(acc.movements)

    calcDisplyBalance(acc)

    calcDisplySummary(acc)
}
const calcDisplyBalance=function(acc){
    acc.balance=acc.movements.reduce((acc,mov)=>acc+=mov,0)
    labelBalance.textContent=`₹ ${acc.balance}`
}
let currentAccount;
btnLogin.addEventListener('click',function(e){
    e.preventDefault() 

    currentAccount=accounts.find(acc=>acc.username===inputLoginUsername.value)
if(currentAccount?.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome back,  ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity=100
    
    inputLoginPin.value=inputLoginUsername.value='';
    
    inputLoginPin.blur()

    updateUi(currentAccount)
}
})
///........TRANSACTION ACCOUNTS.../////

btnTransfer.addEventListener('click',function(e){
    e.preventDefault()
    const amount=Number(inputTransferAmount.value)
    const recieverAcc=accounts.find(
        acc=>acc.username===inputTransferTo.value
    )
     inputTransferAmount.value=inputTransferTo.value=''
    if(amount>0 &&
        recieverAcc&&
        currentAccount.balance>=amount&&
        recieverAcc?.username!==currentAccount.username){
     currentAccount.movements.push(-amount)
     recieverAcc.movements.push(amount)
     updateUi(currentAccount)
     inputTransferTo.blur()
    }
})
////.......ACCOUNT CLOSE......//

btnClose.addEventListener('click',function(e){
    e.preventDefault()

    if(inputCloseUsername.value===currentAccount.username&&
        Number(inputClosePin.value)===currentAccount.pin){
      const index=accounts.findIndex(
        acc=>acc.username===currentAccount.username
      )
      accounts.splice(index,1)

      containerApp.style.opacity=0
    }
    inputCloseUsername.value=inputClosePin.value='';
    inputClosePin.blur()
})

////.....LOAN.......//
btnLoan.addEventListener('click',function(e){
    e.preventDefault()

    const amount=Number(inputLoanAmount.value)

    if(amount>0&&currentAccount.movements.some(mov=>mov>=amount*0.1)){
        currentAccount.movements.push(amount)

        updateUi(currentAccount)
    }
    inputLoanAmount.value=''; 
})

//.......Sorting.......//
let sorted=false
btnSort.addEventListener('click',function(e){
    e.preventDefault()
    displayMovement(currentAccount.movements, !sorted)
    sorted= !sorted
})