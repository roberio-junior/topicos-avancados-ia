from transformers import AutoTokenizer

TEXTO = (
    "Programação, aplicações Web e IA: custo, segurança e explicabilidade."
)

MODELOS = [
    "Qwen/Qwen2.5-0.5B-Instruct",
    "mistralai/Mistral-7B-Instruct-v0.3",
    # Substitua ou acrescente outro checkpoint público compatível.
]

for modelo in MODELOS:
    tokenizer = AutoTokenizer.from_pretrained(modelo)

    ids_texto = tokenizer.encode(TEXTO, add_special_tokens=False)
    ids_mensagem = tokenizer.apply_chat_template(
        [{"role": "user", "content": TEXTO}],
        tokenize=True,
        add_generation_prompt=True,
    )

    tokens_visiveis = tokenizer.convert_ids_to_tokens(ids_texto)
    revisao = tokenizer.init_kwargs.get("_commit_hash", "não informada")

    print("\nModelo:", modelo)
    print("Revisão:", revisao)
    print("Classe:", tokenizer.__class__.__name__)
    print("IDs do texto:", ids_texto)
    print("Tokens visíveis:", tokens_visiveis)
    print("T_texto:", len(ids_texto))
    print("T_mensagem:", len(ids_mensagem))
    print("Overhead:", len(ids_mensagem) - len(ids_texto))