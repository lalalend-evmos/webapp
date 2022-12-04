import { useTheme } from '@mui/material';
import { uniqueId } from 'lodash';
import React, { useRef } from 'react';

import * as icons from './icons';
import wevmosLogo from 'assets/img/tokens/evmos.png';
import atomLogo from 'assets/img/tokens/atom.png';
import osmoLogo from 'assets/img/tokens/osmo.png';
import miaLogo from 'assets/img/tokens/hibou.png';

import daiLogo from 'assets/img/tokens/dai2.png';
import usdcLogo from 'assets/img/tokens/usdc2.png';
import usdtLogo from 'assets/img/tokens/tether.png';
import wethLogo from 'assets/img/tokens/ethereum.png';
import fraxLogo from 'assets/img/tokens/frax.png';
import sebLogo from 'assets/img/tokens/naiLogo.png';


export type IconName = keyof typeof icons;
export interface IconProps {
  name: IconName;
  size?: string;
  color?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IconProps> = ({ name, size, color, ...otherProps }) => {
  const idRef = useRef<string>(uniqueId());

  const theme = useTheme();
  const sanitizedSize = size ?? theme.shape.iconSize.medium;
  const sanitizedColor = color ?? theme.palette.text.secondary;
  // Because "name" could come from fetched data, we use a default icon in case
  // the one requested isn't found
  if(name==="wevmos") {
    return (
      <img src={wevmosLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }

  if(name==="mockatom") {
    return (
      <img src={atomLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="mockosmo") {
    return (
      <img src={osmoLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="mockdai") {
    return (
      <img src={daiLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="mia") {
    return (
      <img src={miaLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="weth") {
    return (
      <img src={wethLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="usdt") {
    return (
      <img src={usdtLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="usdc") {
    return (
      <img src={usdcLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="frax") {
    return (
      <img src={fraxLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }
  if(name==="seb") {
    return (
      <img src={sebLogo} width={30} height={30} style={{marginRight: "10px"}}/>
    )
  }

  const Component =  icons[name] || icons.mask;

  return (
  <Component
    width={sanitizedSize}
    height={sanitizedSize}
    color={sanitizedColor}
    id={idRef.current}
    {...otherProps}
  />
    
    
  );
};
