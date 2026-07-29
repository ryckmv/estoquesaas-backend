import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { FastifyReply } from "fastify";
import { DashboardService } from "./dashboard.service.js";

const dashboardService = new DashboardService();

export class RelatorioService {

  async gerarPDF(
    reply: FastifyReply,
    empresaId: string | bigint
  ) {
    const dados = await dashboardService.resumo(empresaId);

    const doc = new PDFDocument({
      margin: 40,
      size: "A4"
    });

    const buffers: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const COLOR_PRIMARY = "#1e293b"; // Slate 800
      const COLOR_TEXT = "#334155";    // Slate 700
      const COLOR_MUTED = "#64748b";   // Slate 500
      const COLOR_LINE = "#cbd5e1";    // Slate 300

      // ============================
      // CABEÇALHO DO RELATÓRIO
      // ============================
      doc.fontSize(20).font("Helvetica-Bold").fillColor(COLOR_PRIMARY).text("RELATÓRIO GERENCIAL DO SISTEMA", { align: "left" });
      doc.fontSize(10).font("Helvetica").fillColor(COLOR_MUTED).text(`Data de emissão: ${new Date().toLocaleString("pt-BR")}`, { align: "left" });
      
      doc.moveDown(0.5);
      doc.strokeColor(COLOR_LINE).lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1.5);

      const renderSectionHeading = (title: string) => {
        doc.moveDown(1);
        doc.fontSize(12).font("Helvetica-Bold").fillColor(COLOR_PRIMARY).text(title.toUpperCase());
        doc.moveDown(0.3);
        doc.strokeColor(COLOR_LINE).lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.6);
      };

      // ============================
      // 1. RESUMO GERAL
      // ============================
      renderSectionHeading("1. Resumo Geral");

      const resumoRows = [
        ["Total de Produtos Cadastrados", String(dados.resumo.produtos)],
        ["Total de Clientes", String(dados.resumo.clientes)],
        ["Total de Usuários", String(dados.resumo.usuarios)],
        ["Total de Vendas Registradas", String(dados.resumo.vendas)]
      ];

      resumoRows.forEach(([label, value]) => {
        const currentY = doc.y;
        doc.fontSize(10).font("Helvetica").fillColor(COLOR_TEXT).text(label, 40, currentY);
        doc.font("Helvetica-Bold").text(value, 400, currentY, { align: "right", width: 155 });
        doc.moveDown(0.5);
        doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.3);
      });

      // ============================
      // 2. INDICADORES FINANCEIROS
      // ============================
      renderSectionHeading("2. Indicadores Financeiros");

      const financeiroRows = [
        ["Vendas Realizadas Hoje", String(dados.financeiro.vendasHoje)],
        ["Vendas Realizadas no Mês", String(dados.financeiro.vendasMes)],
        ["Faturamento de Hoje", dados.financeiro.faturamentoHoje.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
        ["Faturamento do Mês", dados.financeiro.faturamentoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })]
      ];

      financeiroRows.forEach(([label, value]) => {
        const currentY = doc.y;
        doc.fontSize(10).font("Helvetica").fillColor(COLOR_TEXT).text(label, 40, currentY);
        doc.font("Helvetica-Bold").fillColor("#15803d").text(value, 400, currentY, { align: "right", width: 155 });
        doc.fillColor(COLOR_TEXT);
        doc.moveDown(0.5);
        doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.3);
      });

      // ============================
      // 3. SITUAÇÃO DO ESTOQUE
      // ============================
      renderSectionHeading("3. Situação do Estoque");

      const estoqueRows = [
        ["Valor Total em Estoque", dados.estoque.valorEstoque.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })],
        ["Produtos com Estoque Baixo", String(dados.estoque.estoqueBaixo)],
        ["Produtos Sem Estoque", String(dados.estoque.semEstoque)]
      ];

      estoqueRows.forEach(([label, value]) => {
        const currentY = doc.y;
        doc.fontSize(10).font("Helvetica").fillColor(COLOR_TEXT).text(label, 40, currentY);
        doc.font("Helvetica-Bold").text(value, 400, currentY, { align: "right", width: 155 });
        doc.moveDown(0.5);
        doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
        doc.moveDown(0.3);
      });

      // ============================
      // 4. PRODUTOS MAIS VENDIDOS
      // ============================
      renderSectionHeading("4. Produtos Mais Vendidos");

      const topProducts = dados.produtosMaisVendidos.slice(0, 5);
      
      if (topProducts.length === 0) {
        doc.fontSize(10).font("Helvetica").fillColor(COLOR_MUTED).text("Nenhum registro encontrado.");
      } else {
        topProducts.forEach((produto: { produto: string; quantidade: number }, index: number) => {
          const currentY = doc.y;
          doc.fontSize(10).font("Helvetica").fillColor(COLOR_TEXT);
          doc.text(`${index + 1}. ${produto.produto}`, 40, currentY, { width: 380 });
          doc.font("Helvetica-Bold").text(`${produto.quantidade} unidades`, 400, currentY, { align: "right", width: 155 });
          doc.moveDown(0.5);
          doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
          doc.moveDown(0.3);
        });
      }

      doc.end();
    });

    return reply
      .type("application/pdf")
      .header("Content-Disposition", 'attachment; filename="relatorio.pdf"')
      .send(pdfBuffer);
  }

  async gerarExcel(
    reply: FastifyReply,
    empresaId: string | bigint
  ) {
    const dados = await dashboardService.resumo(empresaId);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Estoque SaaS";
    workbook.created = new Date();

    const headerStyle = {
      font: { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFF" } },
      fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "1E293B" } },
      alignment: { vertical: "middle" as const, horizontal: "left" as const }
    };

    const currencyFormat = '"R$ "#,##0.00';

    // 1. ABA: RESUMO
    const resumo = workbook.addWorksheet("Resumo");
    resumo.columns = [
      { header: "Indicador", key: "indicador", width: 35 },
      { header: "Valor", key: "valor", width: 20 }
    ];
    resumo.getRow(1).font = headerStyle.font;
    resumo.getRow(1).fill = headerStyle.fill;
    resumo.getRow(1).height = 25;

    const resumoData = [
      { indicador: "Total de Produtos Cadastrados", valor: dados.resumo.produtos },
      { indicador: "Total de Clientes", valor: dados.resumo.clientes },
      { indicador: "Total de Usuários", valor: dados.resumo.usuarios },
      { indicador: "Total de Vendas Registradas", valor: dados.resumo.vendas }
    ];

    resumoData.forEach((item, index) => {
      const row = resumo.addRow(item);
      row.getCell("indicador").alignment = { horizontal: "left" };
      row.getCell("valor").alignment = { horizontal: "right" };
      if (index % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
    });

    // 2. ABA: FINANCEIRO
    const financeiro = workbook.addWorksheet("Financeiro");
    financeiro.columns = [
      { header: "Indicador Financeiro", key: "indicador", width: 35 },
      { header: "Valor", key: "valor", width: 25 }
    ];
    financeiro.getRow(1).font = headerStyle.font;
    financeiro.getRow(1).fill = headerStyle.fill;
    financeiro.getRow(1).height = 25;

    const financeiroData = [
      { indicador: "Vendas Realizadas Hoje", valor: dados.financeiro.vendasHoje, isCurrency: false },
      { indicador: "Vendas Realizadas no Mês", valor: dados.financeiro.vendasMes, isCurrency: false },
      { indicador: "Faturamento de Hoje", valor: dados.financeiro.faturamentoHoje, isCurrency: true },
      { indicador: "Faturamento do Mês", valor: dados.financeiro.faturamentoMes, isCurrency: true }
    ];

    financeiroData.forEach((item, index) => {
      const row = financeiro.addRow({ indicador: item.indicador, valor: item.valor });
      row.getCell("indicador").alignment = { horizontal: "left" };
      const valCell = row.getCell("valor");
      valCell.alignment = { horizontal: "right" };
      if (item.isCurrency) valCell.numFmt = currencyFormat;
      if (index % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
    });

    // 3. ABA: ESTOQUE
    const estoque = workbook.addWorksheet("Estoque");
    estoque.columns = [
      { header: "Indicador de Estoque", key: "indicador", width: 35 },
      { header: "Valor", key: "valor", width: 25 }
    ];
    estoque.getRow(1).font = headerStyle.font;
    estoque.getRow(1).fill = headerStyle.fill;
    estoque.getRow(1).height = 25;

    const estoqueData = [
      { indicador: "Valor Total em Estoque", valor: dados.estoque.valorEstoque, isCurrency: true },
      { indicador: "Produtos com Estoque Baixo", valor: dados.estoque.estoqueBaixo, isCurrency: false },
      { indicador: "Produtos Sem Estoque", valor: dados.estoque.semEstoque, isCurrency: false }
    ];

    estoqueData.forEach((item, index) => {
      const row = estoque.addRow({ indicador: item.indicador, valor: item.valor });
      row.getCell("indicador").alignment = { horizontal: "left" };
      const valCell = row.getCell("valor");
      valCell.alignment = { horizontal: "right" };
      if (item.isCurrency) valCell.numFmt = currencyFormat;
      if (index % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
    });

    // 4. ABA: MAIS VENDIDOS
    const vendidos = workbook.addWorksheet("Mais Vendidos");
    vendidos.columns = [
      { header: "Produto", key: "produto", width: 45 },
      { header: "Quantidade Vendida", key: "quantidade", width: 20 }
    ];
    vendidos.getRow(1).font = headerStyle.font;
    vendidos.getRow(1).fill = headerStyle.fill;
    vendidos.getRow(1).height = 25;

    dados.produtosMaisVendidos.forEach((produto: { produto: string; quantidade: number }, index: number) => {
      const row = vendidos.addRow({ produto: produto.produto, quantidade: produto.quantidade });
      row.getCell("produto").alignment = { horizontal: "left" };
      row.getCell("quantidade").alignment = { horizontal: "right" };
      if (index % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
    });

    // 5. ABA: ÚLTIMAS VENDAS
    const vendas = workbook.addWorksheet("Últimas Vendas");
    vendas.columns = [
      { header: "Cliente", key: "cliente", width: 35 },
      { header: "Usuário Responsável", key: "usuario", width: 30 },
      { header: "Valor Total", key: "valor", width: 20 },
      { header: "Status", key: "status", width: 18 },
      { header: "Data da Venda", key: "data", width: 22 }
    ];
    vendas.getRow(1).font = headerStyle.font;
    vendas.getRow(1).fill = headerStyle.fill;
    vendas.getRow(1).height = 25;

    dados.ultimasVendas.forEach((venda: { cliente: string; usuario: string; valor: number; status: string; criadoEm: any }, index: number) => {
      const row = vendas.addRow({
        cliente: venda.cliente,
        usuario: venda.usuario,
        valor: venda.valor,
        status: venda.status,
        data: venda.criadoEm
      });
      row.getCell("cliente").alignment = { horizontal: "left" };
      row.getCell("usuario").alignment = { horizontal: "left" };
      row.getCell("status").alignment = { horizontal: "center" };
      
      const valCell = row.getCell("valor");
      valCell.alignment = { horizontal: "right" };
      valCell.numFmt = currencyFormat;

      const dataCell = row.getCell("data");
      dataCell.alignment = { horizontal: "center" };

      if (index % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F8FAFC" } };
    });

    const excelBuffer = await workbook.xlsx.writeBuffer();

    return reply
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .header("Content-Disposition", 'attachment; filename="relatorio.xlsx"')
      .send(Buffer.from(excelBuffer));
  }

}