import { EditOutlined } from '@ant-design/icons';
import {
  Button, Descriptions, Image, Result, Skeleton, Tag, Tooltip, Upload
} from 'antd';
import ImgCrop from 'antd-img-crop';
import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import { setSessionUserKeyAgainstValue } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import { userStatusAsResponse } from '../../utils/responseAsStatus';

function MyProfile() {
  // fetch user profile API data
  const [loading, error, response] = useFetchData('/api/v1/get-user');

  // function to handle change user avatar
  const changeAvatar = (info) => {
    const data = new FormData();
    data.append('avatar', info.file.originFileObj);

    ApiService.put('/api/v1/avatar-update', data)
      .then((res) => {
        if (res?.result_code === 0) {
          notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'Your avatar change successful');
          setSessionUserKeyAgainstValue('avatar', res?.result?.data?.avatar);
          window.location.reload();
        } else {
          notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
        }
      })
      .catch((err) => {
        notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
      });
  };

  return (
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='error'
        />
      ) : (
        <Descriptions
          title='My Information'
          bordered
          extra={(
            <Button type='default'>
              Edit Profile
            </Button>
          )}
        >
          <Descriptions.Item label='Avatar' span={3}>
            {response?.data?.avatar ? (
              <Image
                className='!w-[100px] !h-[100px]'
                src={response?.data?.avatar}
                crossOrigin='anonymous'
                alt='user-image'
              />
            ) : 'N/A'}

            {/* user avatar change */}
            <div className='absolute ml-24 -mt-[8.5rem]'>
              <Tooltip title='Click to change Avatar'>
                <ImgCrop grid rotate>
                  <Upload accept='image/*' onChange={changeAvatar}>
                    <Button
                      icon={<EditOutlined className='pb-14' />}
                      type='default'
                      shape='circle'
                    />
                  </Upload>
                </ImgCrop>
              </Tooltip>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label='Full Name'>
            {response?.data?.fullName}
          </Descriptions.Item>
          <Descriptions.Item label='User Name' span={2}>
            {response?.data?.userName}
          </Descriptions.Item>
          <Descriptions.Item label='Email'>
            {response?.data?.email}
          </Descriptions.Item>
          <Descriptions.Item label='Phone' span={2}>
            {response?.data?.phone}
          </Descriptions.Item>

          <Descriptions.Item label='Role'>
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.role === 'admin' ? 'magenta' : 'purple'}
            >
              {response?.data?.role}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Status' span={2}>
            <Tag
              className='w-[70px] text-center uppercase'
              color={userStatusAsResponse(response?.data?.status).color}
            >
              {userStatusAsResponse(response?.data?.status).level}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Verified'>
            <Tag
              className='w-[50px] text-center uppercase'
              color={response?.data?.verified ? 'success' : 'error'}
            >
              {response?.data?.verified ? 'Yes' : 'No'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Date Of Birth' span={2}>
            {response?.data?.dob?.split('T')[0] || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label='User Last Update Date'>
            {response?.data?.updatedAt?.split('T')[0]}
          </Descriptions.Item>
          <Descriptions.Item label='User Registration Date' span={2}>
            {response?.data?.createdAt?.split('T')[0]}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Skeleton>
  );
}

export default MyProfile;