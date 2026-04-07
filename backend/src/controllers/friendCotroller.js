import { response } from "../utils/responseHandler.js";
import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user._id;

    if (from === to)
      return response(
        res,
        400,
        "Không thể gửi lời mời kết bạn cho chính mình!",
      );

    const userExists = await User.exists({ _id: to });
    if (!userExists) return response(res, 404, "Người dùng không tồn tại!");

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) [userA, userB] = [userB, userA];

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) return response(res, 400, "Hai người đã là bạn bè!");
    if (existingRequest)
      return response(res, 400, "Đã có lời mời kết bạn đang chờ!");

    const request = await FriendRequest.create({
      from,
      to,
      message,
    });

    return response(res, 201, "Gửi lời mời kết bạn thành công", request);
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu kết bạn", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) return response(res, 404, "Không tìm thấy lời mời kết bạn!");
    if (request.to.toString() !== userId.toString())
      return response(res, 403, "Bạn không có quyền chấp nhận lời mời này!");

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id username avatarUrl")
      .lean();

    return response(res, 200, "Chấp nhận lời mời kết bạn thành công", {
      newFriend: {
        _id: from?._id,
        username: from?.username,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đồng ý lời mời kết bạn", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) return response(res, 404, "Không tìm thấy lời mời kết bạn!");
    if (request.to.toString() !== userId.toString())
      return response(res, 403, "Bạn không có quyền từ chối lời mời này!");

    await FriendRequest.findByIdAndDelete(requestId);

    return response(res, 204);
  } catch (error) {
    console.error("Lỗi khi từ chối lời mời kết bạn", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id username avatarUrl")
      .populate("userB", "_id username avatarUrl")
      .lean();
    
    if (!friendships.length) return response(res, 200, { friends: [] });

    const friends = friendships.map((f) => 
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    );

    return response(res, 200, { friends });
    
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = '_id username avatarUrl';

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields)
    ]);

    return response(res, 200, { sent, received });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
    return response(res, 500, "Lỗi hệ thống");
  }
};