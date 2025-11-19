import { VPNNode } from '@/types';
import { Card } from './Card';
import { formatTON, formatAddress, getCountryFlag } from '@/utils/format';
import { ArrowRight, Signal, Zap } from 'lucide-react';

interface NodeCardProps {
  node: VPNNode;
  onClick: (node: VPNNode) => void;
}

export function NodeCard({ node, onClick }: NodeCardProps) {
  return (
    <Card hoverable onClick={() => onClick(node)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getCountryFlag(node.countryCode)}</span>
            <div>
              <h3 className="font-semibold text-lg">{node.country}</h3>
              <p className="text-sm text-gray-500">{formatAddress(node.wallet)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{node.latency || '--'}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4 text-green-500" />
              <span className={node.isActive ? 'text-green-600' : 'text-red-600'}>
                {node.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            {formatTON(node.pricePerSecond)} TON/s
          </div>
          {node.reputation !== undefined && (
            <div className="text-sm text-gray-600 mt-1">
              ⭐ {node.reputation.toFixed(1)}
            </div>
          )}
          <ArrowRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
        </div>
      </div>
    </Card>
  );
}
