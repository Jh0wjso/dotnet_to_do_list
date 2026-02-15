/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MailCheck, RefreshCw } from "lucide-react";
import { AuthApi } from "@/services/authApi";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError("Informe o email para reenviar o link");
      return;
    }
    setError("");
    setSuccess("");
    setResending(true);
    try {
      await AuthApi.resendConfirmation(email);
      setSuccess("Link de confirmação reenviado! Verifique seu email.");
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
            Verifique seu email e clique no link de confirmação enviado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-primary">{success}</p>}
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleResend}
              disabled={resending}
            >
              <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
              {resending ? "Reenviando..." : "Reenviar link de confirmação"}
            </Button>
            <Button asChild className="w-full">
              <Link to="/login">Ir para Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
