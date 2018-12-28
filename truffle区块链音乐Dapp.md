										区块链最终报告
																	16340320 庄铸滔
1. 源码github地址
https://github.com/873421427/blockchainProject

2. 选题背景，依据
基于区块链和智能合约的分布式音乐应用 选题背景 自从电子记录和分布式系统产生以来，作家和艺术家们发现自己的作品的收入变少了。观众们由于有多个平台的音 乐和视频给他们看，所以观众们在市场中占据主导地位，但是这些平台由于是中心化的，所以要收取不少的手续 费，因此创作者们本身的作品的价格加上中间的手续费才是消费者们实际实际付出的价格。所以导致有一些作品由 于垄断，导致价格偏高，因此催生了不少的盗版影视资源，音乐资源的产生，这严重损坏了创作者们的利益。
 而且，这些中心机构会收集用户们的行为数据，进而分析他们的隐私，对于对自己隐私非常看重的人们来说，这无 疑也是无法容忍的。

	 那么我们就想，如果去掉第三方这个中心机构怎么样，这样的话，音乐创作人就可以直接和用户交易，这对于刚刚 起步的音乐人无疑是个好消息，而对于用户来说，降低了商品的价格。

	 基于目前的区块链技术和智能合约，我们因此可以实现我们的理想，让区块链和智能合约充当第三方机构，用户想 购买音乐就直接在链上交易，真正做到了没有中间商赚差价（鄙视瓜子）。 

	还有一个好处是，真正做到了自由，可以摆脱某些政府或组织强制要求存储发售文化产品的企业更改或下架某些产 品以适合本国或本地区的文化和法规（没别的意思）。 

选题构思 
	
	1. 基于区块链和智能合约，存储用户信息，存储每一条音乐记录，存储每一笔音乐交易记录 

	2. 做到用户只要一次购买，就可以终生享有这首音乐，下载音乐

	3. 用区块链上的挖矿挖到的货币可以购买音乐，购买广告位等，利用了token的激励机制，因为利用挖到的币可 以购买链上的音乐商品，实现了虚拟货币和商品的直接交易。可以有效的促进社区的发展

 	4. 购买音乐的流程用InterPlanetary File System实现真正的音乐文件分布式存储。



3. 具体实现
	区块链只能合约的实现在上次合约部署报告中已有，这里不再赘述。
	说一下Dapp 前端的实现。
	前面是直接在remix上部署合约调试，这次用的是truffle 的框架实现合约的编译，部署，另外用的是内存模拟区块链ganache， 可以帮助快速测试合约
	另外用到了truffle webpack的框架，里面就有例子，可以在现有框架中加入自己的代码。

	前端js 调用智能合约的脚本文件在./app/scripts/index.js里面

	首先要引用web3 和truffle-contract，还有我们已经编译好的合约的json文件

	然后就是添加web3的httpprovider，也就是rpc的地址，我用的是ganche开启时的端口7545，这样才能让我们的脚本通过web3调用合约。

	start函数在每次页面加载的时候都会调用一次，根据目前账户的购买者还是生产者决定加载不同的页面

	加载生产者，会有输入音乐的的标题，价格，还有上传文件的input，上传文件会上传到ipfs中，对特定的文件会产生一个特定的hash值，这就是文件的路径，还会显示已经上传的音乐
	加载购买者，购买者会有当前生产者的所有音乐列表，如果已经购买了，就会显示音乐的路径，负责会显示购买按钮
	还有给自己账户充值，方便购买音乐
	

4. 使用说明
 	``
	npm install 
	``
	首先要开启一个rpc 区块链，我用的是
``
	ganache-cli -p 7545
``
	然后部署合约到区块链上
	``
	truffle migrate --network ganache
	``

	接着要启动ipfs守护程序，让我们可以上传文件
	``
	ipfs daemon
	``
	然后启动dapp 服务器
	``
	npm run dev
	``

5. 测试
	查看自己的地址和余额
	![在这里插入图片描述](https://img-blog.csdnimg.cn/20181228102144486.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMDU5Mzc0,size_16,color_FFFFFF,t_70)

	给账户充值
	![在这里插入图片描述](https://img-blog.csdnimg.cn/2018122810232251.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMDU5Mzc0,size_16,color_FFFFFF,t_70)	  

	对生产者，上传音乐，可以看到在下面产生了文件的哈希路径
	![在这里插入图片描述](https://img-blog.csdnimg.cn/20181228102715358.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMDU5Mzc0,size_16,color_FFFFFF,t_70)

对购买者，可以看到已经上传的所有音乐
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181228102950763.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMDU5Mzc0,size_16,color_FFFFFF,t_70)

然后购买，成功后就会看到音乐的存储路径

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181228103138542.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQxMDU5Mzc0,size_16,color_FFFFFF,t_70)
