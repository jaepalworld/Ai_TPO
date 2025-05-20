import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    updateDoc,
    doc,
    addDoc,
    serverTimestamp,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { firestore } from './firebase';

/**
 * 알림 서비스
 * 알림 관련 Firebase Firestore 작업을 처리하는 서비스 클래스
 */
export const notificationService = {
    /**
     * 사용자의 알림 목록을 가져옵니다
     * @param {string} userId 사용자 ID
     * @param {number} limitCount 가져올 알림 수 제한 (기본값: 50)
     * @returns {Promise<Array>} 알림 목록
     */
    async getNotifications(userId, limitCount = 50) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            const querySnapshot = await getDocs(q);
            const notifications = [];

            querySnapshot.forEach((doc) => {
                notifications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return notifications;
        } catch (error) {
            console.error('알림 가져오기 오류:', error);
            throw error;
        }
    },

    /**
     * 사용자의 알림을 실시간으로 구독합니다
     * @param {string} userId 사용자 ID
     * @param {function} callback 알림 데이터를 받을 콜백 함수
     * @param {number} limitCount 가져올 알림 수 제한 (기본값: 50)
     * @returns {function} 구독 해제 함수
     */
    subscribeToNotifications(userId, callback, limitCount = 50) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            // 실시간 리스너 설정
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const notifications = [];
                querySnapshot.forEach((doc) => {
                    notifications.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                callback(notifications);
            }, (error) => {
                console.error('알림 구독 오류:', error);
            });

            // 구독 해제 함수 반환
            return unsubscribe;
        } catch (error) {
            console.error('알림 구독 설정 오류:', error);
            throw error;
        }
    },

    /**
     * 알림을 읽음으로 표시합니다
     * @param {string} notificationId 알림 ID
     * @returns {Promise<void>}
     */
    async markAsRead(notificationId) {
        try {
            const notificationRef = doc(firestore, 'notifications', notificationId);
            await updateDoc(notificationRef, {
                isRead: true
            });
        } catch (error) {
            console.error('알림 읽음 처리 오류:', error);
            throw error;
        }
    },

    /**
     * 모든 알림을 읽음으로 표시합니다
     * @param {string} userId 사용자 ID
     * @returns {Promise<void>}
     */
    async markAllAsRead(userId) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId),
                where('isRead', '==', false)
            );

            const querySnapshot = await getDocs(q);
            const updatePromises = [];

            querySnapshot.forEach((document) => {
                const notificationRef = doc(firestore, 'notifications', document.id);
                updatePromises.push(updateDoc(notificationRef, { isRead: true }));
            });

            await Promise.all(updatePromises);
        } catch (error) {
            console.error('모든 알림 읽음 처리 오류:', error);
            throw error;
        }
    },

    /**
     * 새 알림을 생성합니다
     * @param {Object} notificationData 알림 데이터
     * @returns {Promise<string>} 생성된 알림 ID
     */
    async createNotification(notificationData) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const newNotification = {
                ...notificationData,
                isRead: false,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(notificationsRef, newNotification);
            return docRef.id;
        } catch (error) {
            console.error('알림 생성 오류:', error);
            throw error;
        }
    },

    /**
     * 사진 완료 알림을 생성합니다
     * @param {string} receiverId 수신자 ID
     * @param {string} photoId 사진 ID
     * @returns {Promise<string>} 생성된 알림 ID
     */
    async createPhotoCompletedNotification(receiverId, photoId) {
        return this.createNotification({
            type: 'photo_completed',
            receiverId,
            photoId
        });
    },

    /**
     * 친구 요청 알림을 생성합니다
     * @param {string} receiverId 수신자 ID
     * @param {string} senderId 발신자 ID
     * @param {string} senderName 발신자 이름
     * @returns {Promise<string>} 생성된 알림 ID
     */
    async createFriendRequestNotification(receiverId, senderId, senderName) {
        return this.createNotification({
            type: 'friend_request',
            receiverId,
            senderId,
            senderName
        });
    },

    /**
     * 새 게시물 알림을 생성합니다
     * @param {string} receiverId 수신자 ID
     * @param {string} senderId 발신자 ID
     * @param {string} senderName 발신자 이름
     * @param {string} postId 게시물 ID
     * @returns {Promise<string>} 생성된 알림 ID
     */
    async createNewPostNotification(receiverId, senderId, senderName, postId) {
        return this.createNotification({
            type: 'new_post',
            receiverId,
            senderId,
            senderName,
            postId
        });
    },

    /**
     * 새 댓글 알림을 생성합니다
     * @param {string} receiverId 수신자 ID
     * @param {string} senderId 발신자 ID
     * @param {string} senderName 발신자 이름
     * @param {string} postId 게시물 ID
     * @param {string} commentId 댓글 ID
     * @returns {Promise<string>} 생성된 알림 ID
     */
    async createNewCommentNotification(receiverId, senderId, senderName, postId, commentId) {
        return this.createNotification({
            type: 'new_comment',
            receiverId,
            senderId,
            senderName,
            postId,
            commentId
        });
    },

    /**
     * 알림을 삭제합니다
     * @param {string} notificationId 알림 ID
     * @returns {Promise<void>}
     */
    async deleteNotification(notificationId) {
        try {
            const notificationRef = doc(firestore, 'notifications', notificationId);
            await deleteDoc(notificationRef);
        } catch (error) {
            console.error('알림 삭제 오류:', error);
            throw error;
        }
    },

    /**
     * 사용자의 모든 알림을 삭제합니다
     * @param {string} userId 사용자 ID
     * @returns {Promise<void>}
     */
    async deleteAllNotifications(userId) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId)
            );

            const querySnapshot = await getDocs(q);
            const deletePromises = [];

            querySnapshot.forEach((document) => {
                const notificationRef = doc(firestore, 'notifications', document.id);
                deletePromises.push(deleteDoc(notificationRef));
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('모든 알림 삭제 오류:', error);
            throw error;
        }
    },

    /**
     * 읽지 않은 알림 수를 가져옵니다
     * @param {string} userId 사용자 ID
     * @returns {Promise<number>} 읽지 않은 알림 수
     */
    async getUnreadCount(userId) {
        try {
            const notificationsRef = collection(firestore, 'notifications');
            const q = query(
                notificationsRef,
                where('receiverId', '==', userId),
                where('isRead', '==', false)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error) {
            console.error('읽지 않은 알림 수 가져오기 오류:', error);
            throw error;
        }
    }
};

export default notificationService;