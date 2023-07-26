currencies = [
    "AED",
    "AFN",
    "ALL",
    "AMD",
    "ANG",
    "AOA",
    "ARS",
    "AUD",
    "AWG",
    "AZN",
    "BAM",
    "BBD",
    "BDT",
    "BGN",
    "BHD",
    "BIF",
    "BMD",
    "BND",
    "BOB",
    "BRL",
    "BSD",
    "BTC",
    "BTN",
    "BWP",
    "BYN",
    "BZD",
    "CAD",
    "CDF",
    "CHF",
    "CLF",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "CUC",
    "CUP",
    "CVE",
    "CZK",
    "DJF",
    "DKK",
    "DOP",
    "DZD",
    "EGP",
    "ERN",
    "ETB",
    "EUR",
    "FJD",
    "FKP",
    "GBP",
    "GEL",
    "GGP",
    "GHS",
    "GIP",
    "GMD",
    "GNF",
    "GTQ",
    "GYD",
    "HKD",
    "HNL",
    "HRK",
    "HTG",
    "HUF",
    "IDR",
    "ILS",
    "IMP",
    "INR",
    "IQD",
    "IRR",
    "ISK",
    "JEP",
    "JMD",
    "JOD",
    "JPY",
    "KES",
    "KGS",
    "KHR",
    "KMF",
    "KPW",
    "KRW",
    "KWD",
    "KYD",
    "KZT",
    "LAK",
    "LBP",
    "LKR",
    "LRD",
    "LSL",
    "LYD",
    "MAD",
    "MDL",
    "MGA",
    "MKD",
    "MMK",
    "MNT",
    "MOP",
    "MRO",
    "MRU",
    "MUR",
    "MVR",
    "MWK",
    "MXN",
    "MYR",
    "MZN",
    "NAD",
    "NGN",
    "NIO",
    "NOK",
    "NPR",
    "NZD",
    "OMR",
    "PAB",
    "PEN",
    "PGK",
    "PHP",
    "PKR",
    "PLN",
    "PYG",
    "QAR",
    "RON",
    "RSD",
    "RUB",
    "RWF",
    "SAR",
    "SBD",
    "SCR",
    "SDG",
    "SEK",
    "SGD",
    "SHP",
    "SLL",
    "SOS",
    "SRD",
    "SSP",
    "STD",
    "STN",
    "SVC",
    "SYP",
    "SZL",
    "THB",
    "TJS",
    "TMT",
    "TND",
    "TOP",
    "TRY",
    "TTD",
    "TWD",
    "TZS",
    "UAH",
    "UGX",
    "USD",
    "UYU",
    "UZS",
    "VEF",
    "VES",
    "VND",
    "VUV",
    "WST",
    "XAF",
    "XAG",
    "XAU",
    "XCD",
    "XDR",
    "XOF",
    "XPD",
    "XPF",
    "XPT",
    "YER",
    "ZAR",
    "ZMW",
    "ZWL",
];


const inputRules = [
    {
        attribute: 'requireNumber',
        isValid: input => isNaN(input.value) === false,
        errorMessage: (label, input) => `${label.textContent} can only be a number`
    },
    {
        attribute: 'required',
        isValid: input => input.value.trim() !== '',
        errorMessage: (label, input) => `${label.textContent} is required` 
    }
]


const fromDropDown = document.querySelector('#from-currency-select')
const toDropDown = document.querySelector('#to-currency-select')
const btnConvert = document.querySelector('.convert-btn')
const result = document.querySelector('.result')
const label = document.querySelector('.currency-content label')
const input = document.querySelector('.currency-content input')
const swapBtn = document.querySelector('.currency-options button')

function loadCurrenciesToSelection(select){
    currencies.forEach(item => {
        const newOption = document.createElement('option')
        newOption.text = item
        newOption.value = item
        select.add(newOption)
    })
}

loadCurrenciesToSelection(fromDropDown)
loadCurrenciesToSelection(toDropDown)

fromDropDown.value = 'USD'
toDropDown.value = 'UAH'

async function convert(optionFrom, optionTo){
    const response = await fetch(`https://v6.exchangerate-api.com/v6/2bcf05f43a30e94ad313e09f/latest/${optionFrom}`)
    const data = await response.json()
    
    return data.conversion_rates[optionTo]
}

btnConvert.addEventListener('click', async () => {

    let isInvalid = false
    for(let option of inputRules){
        if(input.hasAttribute(option.attribute) && !option.isValid(input)){
            input.classList.add('error')
            console.log(option.errorMessage(label, input))
            document.querySelector('.error-message').style.visibility = 'visible'
            document.querySelector('.error-message').innerText = option.errorMessage(label,input)
            isInvalid = true
            return
        }
    }

    if(!isInvalid){
        input.classList.remove('error')
        hideErrorMessage()
    }

    const optionFrom = fromDropDown.value
    const optionTo = toDropDown.value

    const res = await convert(optionFrom, optionTo)
    console.log(res)
    result.innerText = `${input.value} ${optionFrom} = ${(res * + input.value).toFixed(2)} ${optionTo}`
})

function hideErrorMessage(){
    document.querySelector('.error-message').style.visibility = 'hidden'
    document.querySelector('.error-message').innerText = ''
}

async function swapCurrencies(){
    let fromTemp = fromDropDown.value
    fromDropDown.value = toDropDown.value
    toDropDown.value = fromTemp

    const result = await convert(fromDropDown.value,  toDropDown.value)
    result.innerText = `${input.value} ${fromDropDown.value} = ${(result * + input.value).toFixed(2)} ${toDropDown.value}`
}

input.addEventListener('focus', hideErrorMessage)
swapBtn.addEventListener('click', swapCurrencies)