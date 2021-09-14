// eslint-disable-next-line no-unused-vars
import React, { memo } from 'react';
import { View, Text, Button } from '@tarojs/components';

const About = () => {
  return (
    <View className='about'>
      <Text>about page</Text>
      <Button type='primary' onClick={() => console.log('click!!!')}>btn</Button>
    </View>
  )
}

export default memo(About);
