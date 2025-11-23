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
            <span className="text-2xl">{getCountryFlag(node.location.countryCode)}</span>
            <div>
              <h3 className="font-semibold text-lg">{node.location.country}</h3>
              <p className="text-sm text-gray-500">{node.provider?.walletAddress ? formatAddress(node.provider.walletAddress) : 'Unknown'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{node.statistics.responseTime || '--'}ms</span>
            </div>
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4 text-green-500" />
              <span className={node.status === 'online' ? 'text-green-600' : 'text-red-600'}>
                {node.status === 'online' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold text-green-600">
            {formatTON(node.pricing.pricePerHour)} TON/hr
          </div>
          {node.provider?.reputationScore !== undefined && (
            <div className="text-sm text-gray-600 mt-1">
              ⭐ {node.provider.reputationScore}
            </div>
          )}
          <ArrowRight className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
        </div>
      </div>
    </Card>
  );
}
