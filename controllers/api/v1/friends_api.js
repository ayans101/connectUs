const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const Friendship = require("../../../models/friendship");

module.exports.addFriend = async function (req, res) {
    try{
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.params.userId);

        let ifFriendshipExists = await Friendship.findOne({
            from_user: fromUser._id,
            to_user: toUser._id
        })
        if(!ifFriendshipExists){
            let friendship = await Friendship.create({
                from_user: fromUser._id,
                to_user: toUser._id
            });
            fromUser.friendships.push(friendship);
            fromUser.save();
            return res.json(200, {
                message: `Now you're friends with ${toUser.name}`,
                success: true,
                data: {
                    friendship: {
                        _id: friendship._id,
                        to_user: {
                            _id: toUser._id,
                            email: toUser.email,
                            name: toUser.name
                        },
                        from_user: {
                            _id: fromUser._id,
                            email: fromUser.email,
                            name: fromUser.name
                        }
                    }
                }
            });
        }
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }


};

module.exports.removeFriend = async function (req, res) {
    try {
        let fromUser = await User.findById(req.user._id);
        let toUser = await User.findById(req.params.userId);

        let existingFriendship = await Friendship.findOne({
            from_user: fromUser._id,
            to_user: toUser._id
        })
        if(existingFriendship){
            await fromUser.friendships.pull(existingFriendship._id);
            await fromUser.save();
            await existingFriendship.remove();
            return res.json(200, {
                message: `${toUser.name} removed from friends list`,
                success: true
            });
        }
  
      
    } catch (err) {
      console.log(err);
      return res.json(500, {
        message: "Internal Server Error",
      });
    }
  };

module.exports.fetchUserFriends = async function(req, res) {
    try{
        let fromUserId = req.user._id;
        await User.findById(fromUserId, async (err, fromUser) => {
            let friendships = fromUser.friendships;
            let friendsList = [];
            for(let friendship of friendships){
                let friend = await Friendship.findById(friendship)
                .populate({
                    path: 'to_user',
                    select: '_id name email'
                });
                friendsList.push(friend);
            }


            return res.json(200, {
                message: `Friends fetched successfully`,
                success: true,
                data: {
                    friends: friendsList
                }
            });
        });
        
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }

}