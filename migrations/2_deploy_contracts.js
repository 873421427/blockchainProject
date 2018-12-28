/*
var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')

module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
}
*/
const Store = artifacts.require("./Store.sol")

var Web3 = require('web3')
var web3 = new Web3()
console.log(web3)

var arr1 = []
var arr2 = []

var arr3 = ['Eminem', 'Indila', 'Beatles']
var arr4 = ['Sriram', 'Prem', 'Maneesh', 'Goutham', 'Bharath', 'Venky', 'Ravi']

for(e in arr3){
    arr1.push(web3.fromUtf8(arr3[e]))
}

for(e in arr4){
    arr2.push(web3.fromUtf8(arr4[e]))
}
//console.log(web3.fromUtf8("123"))
console.log("string to bytes:",arr1,arr2)

module.exports = function(deployer){
    deployer.deploy(Store,arr1,arr2)
}