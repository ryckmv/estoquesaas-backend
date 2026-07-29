import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
    const email = "master@estoquesaas.com";
    const usuario = await prisma.usuario.findUnique({
        where: { email },
    });
    if (usuario) {
        console.log("✅ Usuário master já existe.");
        return;
    }
    const senhaHash = await bcrypt.hash("123456", 10);
    await prisma.usuario.create({
        data: {
            nome: "Master",
            email,
            senhaHash,
            role: Role.master,
            ativo: true,
            empresaId: null,
        },
    });
    console.log("✅ Usuário master criado com sucesso!");
    console.log("Email: master@estoquesaas.com");
    console.log("Senha: 123456");
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
