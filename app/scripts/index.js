// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
//import metaCoinArtifact from '../../build/contracts/MetaCoin.json'
import StoreArtifact from '../../build/contracts/Store.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
//const MetaCoin = contract(metaCoinArtifact)
const Store = contract(StoreArtifact)


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

let tindex =0

let owners = {}
let buyers = {}

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    Store.setProvider(web3.currentProvider)

    console.log("web3 are ")
    console.log(web3)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accs[tindex]//accounts[1]


      console.log("accounts are ")
      console.log(accounts)

      $("#logs").html("")

      Store.deployed().then(inst =>{
        inst.allOwners().then(ownersArr =>{
          for(let i=0;i<ownersArr.length;i++){
            owners[accounts[i]] = ownersArr[i]
          }
          if(account in owners){
            self.loadOwner()
          }
          else{
            self.loadBuyer()
          }
        })
      })

      //self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  changeAddress: function(){
    let index =parseInt(document.getElementById("indexid").value) 
    tindex = index
    account = accounts[index]
    document.getElementById("address").innerHTML = account
    this.getMoneyInAccount(account)
    this.start()
    //let addr = Web3.utils.fromUtf8(index)
    //document.getElementById("balance").innerHTML = this.getMoneyInAccount(account)
  },

  getMoneyInAccount: function(account){
    //const self = this
    Store.deployed().then(inst =>{
      return inst.getWallet(account)
    }).then(money => {
      document.getElementById("balance").innerHTML = money
    })
  },

  rechargeMoney: function(){
    let money = parseInt(document.getElementById("rechargeMoney").value)
    Store.deployed().then(inst =>{
      return inst.addToWallet(money,{from:account})
    }).then(success => {
      if (success){
      this.getMoneyInAccount(account)
      alert("success")
      }
      else{
        alert("failed")
      }
    })
  },

  loadOwner: function(){
    document.getElementById("usertype").innerHTML = "owner"
    Store.deployed().then(inst => {
      inst.getMusicCount(account).then(num => {
        let count = parseInt(num.c[0])
        if(count !=0){
          $("#logs").append("You have uploaded" + count + "songs")
          for(let i=0;i<count;i++){
            Store.deployed().then(inst2 => {
              inst2.downloadMusic(account,i).then(r1=>{
                let url = r1[0]
                $("#logs").append(web3.toAscii(r1[1]) + "<br>")
                $("#logs").append(url+"<br>")
              })
            })
          }
        }
        else{
          $("#logs").append("You have not  uploaded any songs yet")
        }
      })
    })
    $("#logs").append('<form class="form-inline" action="/"><div class="form-group"><fieldset><h3>Upload Song!</h3><input type="file" class="form-control-file" name="media" id="media"><input type="text" class="form-control" name="title" id="title" placeholder="title"><input class="form-control" type="text" name="price" id="price" placeholder="price">&nbsp:<button type="button" class="btn btn-primary mb-2" onclick="App.upload()">Upload</button></fieldset></div></form></br></br><a id="url"></a><hr></br></br>');
  
  },

  upload:function(){

    console.log("fuck that shi t")
    const self = this
    const reader = new FileReader()
    reader.onloadend = function(){
      const ipfs = window.IpfsApi('127.0.0.1',5002)
      const buf = Buffer.from(reader.result)
      console.log("result is ")
      //console.log(buf)
      ipfs.files.add(buf,(err,result)=>{
        if(err){
          console.log(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log(result[0].hash)
        document.getElementById("url").innerHTML = url
        document.getElementById("url").href = url

        let title = $("#title").val()
        let price =parseInt(document.getElementById("price").value)

        console.log("price is ")
        console.log(price)
        console.log("title is ")
        console.log(title)

        Store.deployed().then(inst => {
           return inst.uploadMusic(url,web3.fromAscii(title),price,{from:account,gas: 1000000})
        }).then(r => {
          console.log("fucking outcome is ")
          console.log(r)
        })
        self.start()
      })
    }
    const song = document.getElementById("media");
    reader.readAsArrayBuffer(song.files[0]); // Read Provided File
  },

  loadBuyer: function(){
    $("#usertype").innerHTML = "buyer"
    Store.deployed().then(async inst =>{
      for(let key in owners){
        $("#logs").append('</br><button type="button" class="btn btn-primary btn-lg btn-block" data-toggle="collapse" data-target=#'+owners[key]+'>'+web3.toAscii(owners[key])+'</button><div id='+owners[key]+' class="collapse"></div>');
        let address = key

        var songsCount = await inst.getMusicCount(address)
        var scount = parseInt(songsCount.c[0])

        if(scount !=0){
          $("#"+owners[key]).append(scount+' songs')
          $("#"+owners[key]).append('<div class="table-responsive"><table class="table table-bordered table-dark"><tbody id='+ owners[key]+"tab" +'>')
          
          for(let i=0;i<scount;i++){
            var r= await inst.downloadMusic(address,i)

            console.log("returned outcome is")
            console.log(r)

            var chkbool = await inst.checkMusicForBuyer(r[0],account)

            if(chkbool){
              $('#'+owners[key]+"tab").append('<tr><td scope="row"><h3>'+web3.toAscii(r[1])+'</h3></td><td>'+ r[0] + '</td></tr>');
            }
            else{
              $('#'+owners[key]+"tab").append('<tr><td scope="row"><h3>'+web3.toAscii(r[1])+'</h3></td><td><h3>'+r[2].c[0]+'$'+'</h3><button type="button" class="btn btn-primary" onclick="App.buy(\'' + r[0] + '\')">Buy</button></td></tr>');
              
            }
          }

          $('#'+owners[key]).append('</tbody></table></div>');
        }
        else{
          $("#"+owners[key]).append('No songs');
        }

      }
    })
  },

  buy: function(url){
    Store.deployed().then(inst => {
      inst.buyMusic(url,{from:account,gas:1000000}).then(suc => {
        if(suc){
          alert("pay successfully")
        }
        else{
          alert("pay failed, make sure you have enough money")
        }
      })
    })
  }


}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})




/*
  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },

  sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value

    this.setStatus('Initiating transaction... (please wait)')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
  }
   */