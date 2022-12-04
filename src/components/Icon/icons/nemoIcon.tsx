import * as React from 'react';
import { SVGProps } from 'react';
import miaIcon from 'assets/img/tokens/nemoIcon2.png';

const MiaIcon = (props: SVGProps<SVGSVGElement>) => (
<div>
    <img src={miaIcon} alt="Test" width={24}/>
  </div>
);

export default MiaIcon;