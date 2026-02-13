/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { authApi } from "@/services/mockApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MailCheck, RefreshCw } from "lucide-react";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [token, setToken] = useState("");
  const [email, setEmail] = useState(emailFromQuery);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      authApi.confirmEmail(token);
      setSuccess("Email confirmado com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (!email) {
      setError("Informe o email para reenviar o código");
      return;
    }
    setError("");
    setSuccess("");
    setResending(true);
    try {
      authApi.resendConfirmation(email);
      setSuccess("Código reenviado! Verifique seu email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Confirmar Email</CardTitle>
          <CardDescription>
            Digite o código de verificação enviado para o seu email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConfirm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-muted/50"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Código de Verificação</Label>
              <Input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o código recebido"
                className="bg-muted/50"
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-primary">{success}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verificando..." : "Confirmar Email"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full gap-2"
              onClick={handleResend}
              disabled={resending}
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Reenviando..." : "Reenviar código"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já confirmou?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
