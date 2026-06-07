import React, { useState } from "react";
import {
  Check,
  Copy,
  Bot,
  KeyRound,
  Globe,
  ShieldCheck,
  Terminal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Monitor,
  Wifi,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Separator } from "@/components/ui/separator";

// ─── Constants ───────────────────────────────────────────────────────────────
const BASE_URL = "https://efms.hnhdecor.com";
const MCP_URL = "https://mcp.hnhdecor.com/mcp";
const OAUTH_CLIENT_ID = "claude-connector";
const OAUTH_CLIENT_SECRET = "scXLlfmeZSXIcCxu8nbWbwzq";

const CLAUDE_CONFIG = JSON.stringify(
  {
    mcpServers: {
      "efms-mcp": {
        type: "http",
        url: MCP_URL,
        oauth: {
          authorization_server_metadata_url: `${BASE_URL}/.well-known/oauth-authorization-server`,
          client_id: "claude-connector",
        },
      },
    },
  },
  null,
  2
);

// ─── Sub-components ──────────────────────────────────────────────────────────

interface CopyFieldProps {
  label: string;
  value: string;
  description?: string;
  mono?: boolean;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, description, mono }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {description && (
          <span className="text-xs text-muted-foreground">— {description}</span>
        )}
      </div>
      <InputGroup>
        <InputGroupInput
          value={value}
          readOnly
          className={mono ? "font-mono text-xs" : "text-sm"}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label="Copy"
            title="Copy"
            size="icon-xs"
            onClick={() => copyToClipboard(value)}
          >
            {isCopied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

interface JsonBlockProps {
  label: string;
  value: string;
}

const JsonBlock: React.FC<JsonBlockProps> = ({ label, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {expanded ? "Thu gọn" : "Mở rộng"}
        </button>
      </div>

      {expanded && (
        <div className="relative group">
          <pre className="bg-muted/40 border border-border/60 rounded-lg p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
            {value}
          </pre>
          <button
            onClick={() => copyToClipboard(value)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-background/80 border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-all shadow-sm opacity-0 group-hover:opacity-100"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-green-500">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Step Badge ───────────────────────────────────────────────────────────────
const StepBadge: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
    <span className="text-xs font-bold text-primary">{step}</span>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const McpSettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Kết nối AI (MCP)</h2>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Tích hợp EFMS với Claude thông qua Model Context Protocol (MCP) để AI có thể truy cập dữ liệu tài chính của bạn.
        </p>
      </div>

      {/* ── Cách 1: Claude.ai Web Connector ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold">Cách 1: Claude.ai (Web)</h3>
          <Badge variant="outline" className="text-xs">Khuyến nghị</Badge>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Thông tin kết nối</CardTitle>
            <CardDescription>
              Nhập các thông tin sau khi thêm Custom Connector trong Claude.ai
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CopyField label="NAME" value="EFMS" description="Tên hiển thị connector" />
            <CopyField label="MCP Server URL" value={MCP_URL} description="Endpoint chính" mono />
            <CopyField label="OAuth Client ID" value={OAUTH_CLIENT_ID} description="Định danh OAuth client" mono />
            <CopyField label="OAuth Client Secret" value={OAUTH_CLIENT_SECRET} description="Mã bảo mật OAuth" mono />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Hướng dẫn từng bước</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {([
                { title: "Truy cập claude.ai", desc: "Mở trình duyệt và đăng nhập tại claude.ai." },
                { title: 'Mở Customize → Connectors', desc: 'Nhấn vào avatar góc trên phải → chọn Customize → tab Connectors.' },
                { title: 'Thêm connector mới', desc: 'Nhấn dấu "+" → chọn Add custom connector.' },
                { title: 'Nhập thông tin kết nối', desc: 'Copy các giá trị NAME, MCP Server URL, OAuth Client ID và OAuth Client Secret từ bảng trên vào form.' },
                { title: 'Lưu và xác thực', desc: 'Nhấn Save. Claude sẽ mở luồng đăng nhập EFMS — đăng nhập bằng tài khoản EFMS của bạn.' },
                { title: 'Kết nối thành công', desc: 'Sau khi xác thực xong, Claude có thể truy cập các chức năng EFMS theo đúng quyền của tài khoản đã đăng nhập.' },
              ] as { title: string; desc: string }[]).map((step, i) => (
                <div key={i} className="flex gap-4">
                  <StepBadge step={i + 1} />
                  <div className="flex-1 space-y-1 pt-0.5">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security note */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
            Không chia sẻ thông tin kết nối và OAuth Client Secret cho người không được phép sử dụng hệ thống.
          </span>
        </div>
      </div>

      <Separator />

      {/* ── Cách 2: Claude Desktop ───────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          <h3 className="text-base font-semibold">Cách 2: Claude Desktop</h3>
          <Badge variant="secondary" className="text-xs">Nâng cao</Badge>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">MCP Server đang hoạt động</p>
            <p className="text-xs text-muted-foreground truncate">{MCP_URL}</p>
          </div>
          <a
            href={MCP_URL.replace("/mcp", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Section 1: OAuth Endpoints */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">OAuth 2.1 Endpoints</CardTitle>
          </div>
          <CardDescription>
            Các endpoint xác thực dùng để cấu hình OAuth flow với Claude Desktop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <CopyField
            label="Authorization Endpoint"
            value={`${BASE_URL}/oauth/authorize`}
            description="Trang xác nhận OAuth"
            mono
          />
          <CopyField
            label="Token Endpoint"
            value={`${BASE_URL}/oauth/token`}
            description="Đổi code lấy access token"
            mono
          />
          <CopyField
            label="Metadata URL"
            value={`${BASE_URL}/.well-known/oauth-authorization-server`}
            description="Auto-discovery (khuyến nghị dùng)"
            mono
          /> */}

          {/* <Separator className="my-2" /> */}

          <CopyField
            label="Client ID"
            value="claude-connector"
            description="Định danh OAuth client"
            mono
          />

          <CopyField
            label="Client Secret Key"
            value="scXLlfmeZSXIcCxu8nbWbwzq"
            description="Mã bảo mật OAuth"
            mono
          />
        </CardContent>
      </Card>

      {/* Section 2: MCP Server */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">MCP Server</CardTitle>
          </div>
          <CardDescription>
            Endpoint MCP server dùng HTTP/SSE transport
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CopyField
            label="MCP URL"
            value={MCP_URL}
            description="Endpoint chính cho Claude Desktop"
            mono
          />
          <CopyField
            label="Transport Type"
            value="http"
            description="Streaming HTTP (StreamableHTTP)"
          />

          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              MCP server yêu cầu Bearer token hợp lệ được cấp qua OAuth flow. Claude Desktop sẽ tự động xử lý luồng xác thực khi bạn cấu hình đúng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Claude Desktop Config */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Cấu hình Claude Desktop</CardTitle>
          </div>
          <CardDescription>
            Copy đoạn JSON sau và dán vào file <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">claude_desktop_config.json</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JsonBlock label="claude_desktop_config.json" value={CLAUDE_CONFIG} />
        </CardContent>
      </Card>

      {/* Section 4: Hướng dẫn từng bước */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">Hướng dẫn cài đặt</CardTitle>
          </div>
          <CardDescription>
            Làm theo các bước sau để kết nối Claude Desktop với EFMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              {
                title: "Mở file cấu hình Claude Desktop",
                desc: (
                  <>
                    Trên <strong>macOS</strong>:{" "}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      ~/Library/Application Support/Claude/claude_desktop_config.json
                    </code>
                    <br />
                    Trên <strong>Windows</strong>:{" "}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      %APPDATA%\Claude\claude_desktop_config.json
                    </code>
                  </>
                ),
              },
              {
                title: "Dán cấu hình JSON vào file",
                desc: "Copy đoạn JSON ở mục trên và paste vào file. Nếu file đã có nội dung, merge key \"mcpServers\" vào object hiện tại.",
              },
              {
                title: "Khởi động lại Claude Desktop",
                desc: "Thoát và mở lại Claude Desktop để áp dụng cấu hình mới.",
              },
              {
                title: "Xác thực OAuth",
                desc: "Lần đầu sử dụng, Claude Desktop sẽ mở trình duyệt để bạn đăng nhập EFMS và xác nhận cấp quyền. Sau đó token được lưu tự động.",
              },
              {
                title: "Kiểm tra kết nối",
                desc: (
                  <>
                    Trong Claude Desktop, nhấn biểu tượng 🔌 để xem danh sách MCP tools. Bạn sẽ thấy{" "}
                    <strong>efms-mcp</strong> với các tools như{" "}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">list-partners</code>,{" "}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">list-invoices</code>, v.v.
                  </>
                ),
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <StepBadge step={i + 1} />
                <div className="flex-1 space-y-1 pt-0.5">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default McpSettingsPage;
