pragma solidity ^0.5.0; //We have to specify what version of the compiler this code will use

contract Store{

    struct Music {
        address owner; // who create this song
        bytes32 title; // the name of this song
        uint price ;   // the price of this song
        address[] buyers; // who buy this song
    }

    struct Owner {
        string[] ownerMusicList; // 存的是url
    }

    struct Buyer {
        string[] buyerMusicList; //store url of the song
    }

    string[] allMusic; // store all music

    mapping (address => uint) public wallets;  //store money
    mapping (string => Music) musicStructs;  //
    mapping (address => Owner) ownerStructs;  //each address maps to a owner
    mapping (address => Buyer) buyerStructs;


    bytes32[] public ownersList;
    bytes32[] public buyersList;

    event Transfer(address from, address to, uint256 value);

    constructor (bytes32[] memory owners, bytes32[] memory buyers)  public {
        ownersList = owners;
        buyersList = buyers;
    }

    function buyMusic(string  memory code) public returns(bool success){
        uint amount = musicStructs[code].price;
        address receiver = musicStructs[code].owner;
        if (wallets[msg.sender] < musicStructs[code].price) return false;
        wallets[msg.sender] -= amount;
        wallets[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
        buyerStructs[msg.sender].buyerMusicList.push(code);
        musicStructs[code].buyers.push(msg.sender);
        return true;
    }


    function uploadMusic(string memory code, bytes32 musicName, uint cost)  public payable returns(bytes32, uint) {
        require(validMusic(code));
        ownerStructs[msg.sender].ownerMusicList.push(code);
        allMusic.push(code);
        musicStructs[code].owner = msg.sender;
        musicStructs[code].title = musicName;
        musicStructs[code].price = cost;
        return (musicStructs[code].title,musicStructs[code].price);
    }

    function allOwners() public view returns (bytes32[] memory ){
        return ownersList;
    }

    function allBuyers()  public view returns (bytes32[] memory ){
        return buyersList;
    }

    function getWallet(address pAddress) public view  returns(uint){
        return wallets[pAddress];
    }

    function downloadMusic(address ownerAddress, uint index) public view  returns (string memory , bytes32, uint) {
        string memory url = ownerStructs[ownerAddress].ownerMusicList[index];
        return (url, musicStructs[url].title, musicStructs[url].price);
    }

    function checkMusicForBuyer(string memory code, address buyerAddress) public  view returns (bool){
        for(uint i = 0; i < buyerStructs[buyerAddress].buyerMusicList.length; i++){
          if(keccak256(bytes(buyerStructs[buyerAddress].buyerMusicList[i])) == keccak256(bytes(code))) {
            return true;
          }
        }   
        return false;
    }

    function getMusicCount(address ownerAddress) public view  returns (uint){
        return ownerStructs[ownerAddress].ownerMusicList.length;
    }

    function addToWallet(uint amount ) public payable  returns (bool success){
        wallets[msg.sender] += amount;
        return true;
    }

    function validMusic(string memory code)public view  returns (bool){
        for(uint i = 0; i < allMusic.length;i++){
            if (keccak256(bytes(allMusic[i])) == keccak256(bytes(code))){
                return false;
            }
        }
        return true;
    }
    
    /*
    function toBytes(address x) public  returns (bytes memory  b) {
        b = new bytes(20);
        for (uint i = 0; i < 20; i++)
        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
    }
    */

}
