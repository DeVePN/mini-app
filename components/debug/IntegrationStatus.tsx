'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Check, X, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'failed' | 'warning';
  message?: string;
  details?: any;
}

/**
 * Integration Status Debug Component
 *
 * Drop this component into any page to visually verify frontend-backend integration.
 * Shows real-time status of backend connectivity, API calls, and data transformation.
 *
 * Usage:
 * ```tsx
 * import { IntegrationStatus } from '@/components/debug/IntegrationStatus';
 *
 * // In your component:
 * <IntegrationStatus />
 * ```
 *
 * Remove from production code!
 */
export function IntegrationStatus() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Environment Config', status: 'pending' },
    { name: 'Backend Connectivity', status: 'pending' },
    { name: 'Nodes API', status: 'pending' },
    { name: 'Data Transformation', status: 'pending' },
  ]);

  const [testing, setTesting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setTesting(true);
    const newTests: TestResult[] = [];

    // Test 1: Environment Configuration
    const envTest = await testEnvironmentConfig();
    newTests.push(envTest);
    setTests([...newTests]);

    // Test 2: Backend Connectivity
    const connectivityTest = await testBackendConnectivity();
    newTests.push(connectivityTest);
    setTests([...newTests]);

    // Test 3: Nodes API
    const nodesTest = await testNodesAPI();
    newTests.push(nodesTest);
    setTests([...newTests]);

    // Test 4: Data Transformation
    const transformTest = await testDataTransformation();
    newTests.push(transformTest);
    setTests([...newTests]);

    setTesting(false);
  };

  const testEnvironmentConfig = async (): Promise<TestResult> => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      return {
        name: 'Environment Config',
        status: 'failed',
        message: 'NEXT_PUBLIC_BACKEND_URL not set',
      };
    }

    if (backendUrl.includes('localhost')) {
      return {
        name: 'Environment Config',
        status: 'warning',
        message: 'Using localhost (should be Railway for production)',
        details: { backendUrl },
      };
    }

    return {
      name: 'Environment Config',
      status: 'success',
      message: 'Backend URL configured',
      details: { backendUrl },
    };
  };

  const testBackendConnectivity = async (): Promise<TestResult> => {
    try {
      const startTime = Date.now();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nodes`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        return {
          name: 'Backend Connectivity',
          status: 'failed',
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        name: 'Backend Connectivity',
        status: 'success',
        message: `Connected (${responseTime}ms)`,
        details: { responseTime, status: response.status },
      };
    } catch (error: any) {
      return {
        name: 'Backend Connectivity',
        status: 'failed',
        message: error.message || 'Network error',
      };
    }
  };

  const testNodesAPI = async (): Promise<TestResult> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/nodes`
      );

      if (!response.ok) {
        return {
          name: 'Nodes API',
          status: 'failed',
          message: `API returned ${response.status}`,
        };
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        return {
          name: 'Nodes API',
          status: 'failed',
          message: 'Response is not an array',
        };
      }

      if (data.length === 0) {
        return {
          name: 'Nodes API',
          status: 'warning',
          message: 'No nodes found (database empty)',
          details: { nodeCount: 0 },
        };
      }

      return {
        name: 'Nodes API',
        status: 'success',
        message: `Found ${data.length} node(s)`,
        details: { nodeCount: data.length, sampleNode: data[0] },
      };
    } catch (error: any) {
      return {
        name: 'Nodes API',
        status: 'failed',
        message: error.message || 'API call failed',
      };
    }
  };

  const testDataTransformation = async (): Promise<TestResult> => {
    try {
      // Use the API client which applies transformations
      const nodes = await api.getNodes();

      if (!Array.isArray(nodes)) {
        return {
          name: 'Data Transformation',
          status: 'failed',
          message: 'Transformed data is not an array',
        };
      }

      if (nodes.length === 0) {
        return {
          name: 'Data Transformation',
          status: 'warning',
          message: 'No nodes to transform (database empty)',
        };
      }

      const sampleNode = nodes[0];

      // Check if transformation worked
      const hasTransformedFields =
        typeof sampleNode.id === 'string' &&
        sampleNode.pricing &&
        typeof sampleNode.pricing.pricePerHour === 'number';

      if (!hasTransformedFields) {
        return {
          name: 'Data Transformation',
          status: 'failed',
          message: 'Data not transformed to frontend format',
          details: { sampleNode },
        };
      }

      return {
        name: 'Data Transformation',
        status: 'success',
        message: 'Data transformed correctly',
        details: {
          nodeCount: nodes.length,
          sampleNode: {
            id: sampleNode.id,
            name: sampleNode.name,
            pricing: sampleNode.pricing,
          },
        },
      };
    } catch (error: any) {
      return {
        name: 'Data Transformation',
        status: 'failed',
        message: error.message || 'Transformation failed',
      };
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600">Pass</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-600">Warn</Badge>;
      case 'pending':
        return <Badge className="bg-gray-400">...</Badge>;
    }
  };

  const allPassed = tests.every((t) => t.status === 'success' || t.status === 'warning');
  const anyFailed = tests.some((t) => t.status === 'failed');

  return (
    <Card className="p-4 border-2 border-dashed border-purple-500 bg-purple-50 dark:bg-purple-950">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <h3 className="font-semibold text-purple-900 dark:text-purple-100">
            Integration Status (Debug)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {allPassed && !anyFailed && (
            <Badge className="bg-green-600">All Systems OK</Badge>
          )}
          {anyFailed && <Badge className="bg-red-600">Issues Detected</Badge>}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={runTests}
            disabled={testing}
          >
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retest
              </>
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
            >
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{test.name}</span>
                    {getStatusBadge(test.status)}
                  </div>
                  {test.message && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {test.message}
                    </p>
                  )}
                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        View Details
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-900/50 rounded text-xs">
        <p className="font-semibold text-purple-900 dark:text-purple-100">
          Development Only
        </p>
        <p className="text-purple-800 dark:text-purple-200 mt-1">
          This debug component verifies FE-BE integration. Remove before
          production deployment.
        </p>
      </div>
    </Card>
  );
}
