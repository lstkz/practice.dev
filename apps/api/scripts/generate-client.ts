import * as ts from 'typescript';
import * as fs from 'fs';
import * as util from 'util';

interface DocEntry {
  name?: string;
  fileName?: string;
  documentation?: string;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
}

const kindMap = {
  0: 'Unknown',
  1: 'EndOfFileToken',
  2: 'SingleLineCommentTrivia',
  3: 'MultiLineCommentTrivia',
  4: 'NewLineTrivia',
  5: 'WhitespaceTrivia',
  6: 'ShebangTrivia',
  7: 'ConflictMarkerTrivia',
  8: 'NumericLiteral',
  9: 'BigIntLiteral',
  10: 'StringLiteral',
  11: 'JsxText',
  12: 'JsxTextAllWhiteSpaces',
  13: 'RegularExpressionLiteral',
  14: 'NoSubstitutionTemplateLiteral',
  15: 'TemplateHead',
  16: 'TemplateMiddle',
  17: 'TemplateTail',
  18: 'OpenBraceToken',
  19: 'CloseBraceToken',
  20: 'OpenParenToken',
  21: 'CloseParenToken',
  22: 'OpenBracketToken',
  23: 'CloseBracketToken',
  24: 'DotToken',
  25: 'DotDotDotToken',
  26: 'SemicolonToken',
  27: 'CommaToken',
  28: 'LessThanToken',
  29: 'LessThanSlashToken',
  30: 'GreaterThanToken',
  31: 'LessThanEqualsToken',
  32: 'GreaterThanEqualsToken',
  33: 'EqualsEqualsToken',
  34: 'ExclamationEqualsToken',
  35: 'EqualsEqualsEqualsToken',
  36: 'ExclamationEqualsEqualsToken',
  37: 'EqualsGreaterThanToken',
  38: 'PlusToken',
  39: 'MinusToken',
  40: 'AsteriskToken',
  41: 'AsteriskAsteriskToken',
  42: 'SlashToken',
  43: 'PercentToken',
  44: 'PlusPlusToken',
  45: 'MinusMinusToken',
  46: 'LessThanLessThanToken',
  47: 'GreaterThanGreaterThanToken',
  48: 'GreaterThanGreaterThanGreaterThanToken',
  49: 'AmpersandToken',
  50: 'BarToken',
  51: 'CaretToken',
  52: 'ExclamationToken',
  53: 'TildeToken',
  54: 'AmpersandAmpersandToken',
  55: 'BarBarToken',
  56: 'QuestionToken',
  57: 'ColonToken',
  58: 'AtToken',
  59: 'BacktickToken',
  60: 'EqualsToken',
  61: 'PlusEqualsToken',
  62: 'MinusEqualsToken',
  63: 'AsteriskEqualsToken',
  64: 'AsteriskAsteriskEqualsToken',
  65: 'SlashEqualsToken',
  66: 'PercentEqualsToken',
  67: 'LessThanLessThanEqualsToken',
  68: 'GreaterThanGreaterThanEqualsToken',
  69: 'GreaterThanGreaterThanGreaterThanEqualsToken',
  70: 'AmpersandEqualsToken',
  71: 'BarEqualsToken',
  72: 'CaretEqualsToken',
  73: 'Identifier',
  74: 'BreakKeyword',
  75: 'CaseKeyword',
  76: 'CatchKeyword',
  77: 'ClassKeyword',
  78: 'ConstKeyword',
  79: 'ContinueKeyword',
  80: 'DebuggerKeyword',
  81: 'DefaultKeyword',
  82: 'DeleteKeyword',
  83: 'DoKeyword',
  84: 'ElseKeyword',
  85: 'EnumKeyword',
  86: 'ExportKeyword',
  87: 'ExtendsKeyword',
  88: 'FalseKeyword',
  89: 'FinallyKeyword',
  90: 'ForKeyword',
  91: 'FunctionKeyword',
  92: 'IfKeyword',
  93: 'ImportKeyword',
  94: 'InKeyword',
  95: 'InstanceOfKeyword',
  96: 'NewKeyword',
  97: 'NullKeyword',
  98: 'ReturnKeyword',
  99: 'SuperKeyword',
  100: 'SwitchKeyword',
  101: 'ThisKeyword',
  102: 'ThrowKeyword',
  103: 'TrueKeyword',
  104: 'TryKeyword',
  105: 'TypeOfKeyword',
  106: 'VarKeyword',
  107: 'VoidKeyword',
  108: 'WhileKeyword',
  109: 'WithKeyword',
  110: 'ImplementsKeyword',
  111: 'InterfaceKeyword',
  112: 'LetKeyword',
  113: 'PackageKeyword',
  114: 'PrivateKeyword',
  115: 'ProtectedKeyword',
  116: 'PublicKeyword',
  117: 'StaticKeyword',
  118: 'YieldKeyword',
  119: 'AbstractKeyword',
  120: 'AsKeyword',
  121: 'AnyKeyword',
  122: 'AsyncKeyword',
  123: 'AwaitKeyword',
  124: 'BooleanKeyword',
  125: 'ConstructorKeyword',
  126: 'DeclareKeyword',
  127: 'GetKeyword',
  128: 'InferKeyword',
  129: 'IsKeyword',
  130: 'KeyOfKeyword',
  131: 'ModuleKeyword',
  132: 'NamespaceKeyword',
  133: 'NeverKeyword',
  134: 'ReadonlyKeyword',
  135: 'RequireKeyword',
  136: 'NumberKeyword',
  137: 'ObjectKeyword',
  138: 'SetKeyword',
  139: 'StringKeyword',
  140: 'SymbolKeyword',
  141: 'TypeKeyword',
  142: 'UndefinedKeyword',
  143: 'UniqueKeyword',
  144: 'UnknownKeyword',
  145: 'FromKeyword',
  146: 'GlobalKeyword',
  147: 'BigIntKeyword',
  148: 'OfKeyword',
  149: 'QualifiedName',
  150: 'ComputedPropertyName',
  151: 'TypeParameter',
  152: 'Parameter',
  153: 'Decorator',
  154: 'PropertySignature',
  155: 'PropertyDeclaration',
  156: 'MethodSignature',
  157: 'MethodDeclaration',
  158: 'Constructor',
  159: 'GetAccessor',
  160: 'SetAccessor',
  161: 'CallSignature',
  162: 'ConstructSignature',
  163: 'IndexSignature',
  164: 'TypePredicate',
  165: 'TypeReference',
  166: 'FunctionType',
  167: 'ConstructorType',
  168: 'TypeQuery',
  169: 'TypeLiteral',
  170: 'ArrayType',
  171: 'TupleType',
  172: 'OptionalType',
  173: 'RestType',
  174: 'UnionType',
  175: 'IntersectionType',
  176: 'ConditionalType',
  177: 'InferType',
  178: 'ParenthesizedType',
  179: 'ThisType',
  180: 'TypeOperator',
  181: 'IndexedAccessType',
  182: 'MappedType',
  183: 'LiteralType',
  184: 'ImportType',
  185: 'ObjectBindingPattern',
  186: 'ArrayBindingPattern',
  187: 'BindingElement',
  188: 'ArrayLiteralExpression',
  189: 'ObjectLiteralExpression',
  190: 'PropertyAccessExpression',
  191: 'ElementAccessExpression',
  192: 'CallExpression',
  193: 'NewExpression',
  194: 'TaggedTemplateExpression',
  195: 'TypeAssertionExpression',
  196: 'ParenthesizedExpression',
  197: 'FunctionExpression',
  198: 'ArrowFunction',
  199: 'DeleteExpression',
  200: 'TypeOfExpression',
  201: 'VoidExpression',
  202: 'AwaitExpression',
  203: 'PrefixUnaryExpression',
  204: 'PostfixUnaryExpression',
  205: 'BinaryExpression',
  206: 'ConditionalExpression',
  207: 'TemplateExpression',
  208: 'YieldExpression',
  209: 'SpreadElement',
  210: 'ClassExpression',
  211: 'OmittedExpression',
  212: 'ExpressionWithTypeArguments',
  213: 'AsExpression',
  214: 'NonNullExpression',
  215: 'MetaProperty',
  216: 'SyntheticExpression',
  217: 'TemplateSpan',
  218: 'SemicolonClassElement',
  219: 'Block',
  220: 'VariableStatement',
  221: 'EmptyStatement',
  222: 'ExpressionStatement',
  223: 'IfStatement',
  224: 'DoStatement',
  225: 'WhileStatement',
  226: 'ForStatement',
  227: 'ForInStatement',
  228: 'ForOfStatement',
  229: 'ContinueStatement',
  230: 'BreakStatement',
  231: 'ReturnStatement',
  232: 'WithStatement',
  233: 'SwitchStatement',
  234: 'LabeledStatement',
  235: 'ThrowStatement',
  236: 'TryStatement',
  237: 'DebuggerStatement',
  238: 'VariableDeclaration',
  239: 'VariableDeclarationList',
  240: 'FunctionDeclaration',
  241: 'ClassDeclaration',
  242: 'InterfaceDeclaration',
  243: 'TypeAliasDeclaration',
  244: 'EnumDeclaration',
  245: 'ModuleDeclaration',
  246: 'ModuleBlock',
  247: 'CaseBlock',
  248: 'NamespaceExportDeclaration',
  249: 'ImportEqualsDeclaration',
  250: 'ImportDeclaration',
  251: 'ImportClause',
  252: 'NamespaceImport',
  253: 'NamedImports',
  254: 'ImportSpecifier',
  255: 'ExportAssignment',
  256: 'ExportDeclaration',
  257: 'NamedExports',
  258: 'ExportSpecifier',
  259: 'MissingDeclaration',
  260: 'ExternalModuleReference',
  261: 'JsxElement',
  262: 'JsxSelfClosingElement',
  263: 'JsxOpeningElement',
  264: 'JsxClosingElement',
  265: 'JsxFragment',
  266: 'JsxOpeningFragment',
  267: 'JsxClosingFragment',
  268: 'JsxAttribute',
  269: 'JsxAttributes',
  270: 'JsxSpreadAttribute',
  271: 'JsxExpression',
  272: 'CaseClause',
  273: 'DefaultClause',
  274: 'HeritageClause',
  275: 'CatchClause',
  276: 'PropertyAssignment',
  277: 'ShorthandPropertyAssignment',
  278: 'SpreadAssignment',
  279: 'EnumMember',
  280: 'UnparsedPrologue',
  281: 'UnparsedPrepend',
  282: 'UnparsedText',
  283: 'UnparsedInternalText',
  284: 'UnparsedSyntheticReference',
  285: 'SourceFile',
  286: 'Bundle',
  287: 'UnparsedSource',
  288: 'InputFiles',
  289: 'JSDocTypeExpression',
  290: 'JSDocAllType',
  291: 'JSDocUnknownType',
  292: 'JSDocNullableType',
  293: 'JSDocNonNullableType',
  294: 'JSDocOptionalType',
  295: 'JSDocFunctionType',
  296: 'JSDocVariadicType',
  297: 'JSDocComment',
  298: 'JSDocTypeLiteral',
  299: 'JSDocSignature',
  300: 'JSDocTag',
  301: 'JSDocAugmentsTag',
  302: 'JSDocClassTag',
  303: 'JSDocCallbackTag',
  304: 'JSDocEnumTag',
  305: 'JSDocParameterTag',
  306: 'JSDocReturnTag',
  307: 'JSDocThisTag',
  308: 'JSDocTypeTag',
  309: 'JSDocTemplateTag',
  310: 'JSDocTypedefTag',
  311: 'JSDocPropertyTag',
  312: 'SyntaxList',
  313: 'NotEmittedStatement',
  314: 'PartiallyEmittedExpression',
  315: 'CommaListExpression',
  316: 'MergeDeclarationMarker',
  317: 'EndOfDeclarationMarker',
  318: 'Count',
  //  60: 'FirstAssignment',
  //  72: 'LastAssignment',
  //  61: 'FirstCompoundAssignment',
  //  72: 'LastCompoundAssignment',
  //  74: 'FirstReservedWord',
  //  109: 'LastReservedWord',
  //  74: 'FirstKeyword',
  //  148: 'LastKeyword',
  //  110: 'FirstFutureReservedWord',
  //  118: 'LastFutureReservedWord',
  //  164: 'FirstTypeNode',
  //  184: 'LastTypeNode',
  //  18: 'FirstPunctuation',
  //  72: 'LastPunctuation',
  //  0: 'FirstToken',
  //  148: 'LastToken',
  //  2: 'FirstTriviaToken',
  //  7: 'LastTriviaToken',
  //  8: 'FirstLiteralToken',
  //  14: 'LastLiteralToken',
  //  14: 'FirstTemplateToken',
  //  17: 'LastTemplateToken',
  //  28: 'FirstBinaryOperator',
  //  72: 'LastBinaryOperator',
  //  149: 'FirstNode',
  //  289: 'FirstJSDocNode',
  //  311: 'LastJSDocNode',
  //  300: 'FirstJSDocTagNode',
  //  311: 'LastJSDocTagNode',
};

function _sanitizeObject(obj: any) {
  if (obj === undefined) {
    return obj;
  }
  const seen: any[] = [];
  return JSON.parse(
    JSON.stringify(obj, (name, value) => {
      if (seen.indexOf(value) !== -1) {
        return '[Circular]';
      }
      if (value != null && typeof value === 'object') {
        seen.push(value);
      }
      if (name === 'kind') {
        return kindMap[value as 0];
      }
      // Array of field names that should not be logged
      // add field if necessary (password, tokens etc)
      if (['parent', 'checker'].indexOf(name) !== -1) {
        return '<removed>';
      }
      return value;
    })
  );
}

function normalizeType(str: string) {
  // str = str.replace(/ConvertObject\d?/g, '');
  // str = str.replace(/ExtractObject\d?/g, '');

  // str = str.replace(/\<|\>/g, '');
  return str;
}

export function serializeObject(obj: any) {
  return util.inspect(_sanitizeObject(obj), { depth: 10 });
}

function showTree(node: ts.Node, indent: string = '    '): void {
  console.log(indent + ts.SyntaxKind[node.kind]);

  if (node.getChildCount() === 0) {
    console.log(indent + '    Text: ' + node.getText());
  }

  for (let child of node.getChildren()) {
    showTree(child, indent + '    ');
  }
}

type TypeInfo = { type: ts.Type & { typeArguments: ts.Type[] } };

interface ParsedSchema {
  type: string;
  required: boolean;
}

function isNodeExported(node: ts.Node): boolean {
  return (
    (ts.getCombinedModifierFlags(node as ts.Declaration) &
      ts.ModifierFlags.Export) !==
      0 ||
    (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
  );
}

function parseSchemaType(type: TypeInfo): ParsedSchema {
  const isTrueBool = (type: ts.Type) => (type as any).intrinsicName === 'true';

  const required = isTrueBool(type.type.typeArguments[0]);
  const nullable = isTrueBool(type.type.typeArguments[1]);

  const makeResult = (name: string) => {
    return {
      type: `${name}${nullable ? ' | null' : ''}`,
      required,
    };
  };

  const getLastArgType = () => {
    const lastArg: any = type.type.typeArguments[2];
    return {
      ...lastArg,
      type: {
        ...lastArg,
        typeArguments: lastArg.typeArguments,
      },
    };
  };

  const schemaName = ts.symbolName(type.type.symbol);
  switch (schemaName) {
    case 'AnySchema':
      return makeResult('any');
    case 'NumberSchema':
      return makeResult('number');
    case 'StringSchema':
      return makeResult('string');
    case 'DateSchema':
      return makeResult('Date');
    case 'BooleanSchema':
      return makeResult('boolean');
    case 'ArraySchema': {
      const lastArg = getLastArgType();
      const subType = parseSchemaType(lastArg);
      return makeResult(
        `Array<${subType.type}${subType.required ? '' : ' | null'}>`
      );
    }
    case 'ObjectSchema': {
      // console.log(type.type.typeArguments[2]);
      const lastArg = getLastArgType();
      return { type: travelType(lastArg), required };
    }
    default: {
      return { type: 'unknown', required };
    }
  }
}

function travelType(type: ts.Type): string {
  // console.log(type.g)
  if (type.aliasSymbol) {
    const name = ts.symbolName(type.aliasSymbol);
    // console.log(name);
    if (name === 'ConvertObject' || name === 'ExtractObject') {
      return travelType(type.aliasTypeArguments![0]);
    }
    throw new Error('Unknown alias: ' + name);
  } else {
    const name = ts.symbolName(type.symbol);

    if (name === '__object') {
      const props: Array<ts.Symbol & TypeInfo> = (type as any).properties;
      const fields: string[] = [];

      props.forEach(item => {
        const prop = ts.symbolName(item);
        const parsed = parseSchemaType(item);
        fields.push(`${prop}${parsed.required ? '' : '?'}: ${parsed.type}`);
      });
      return `{${fields.join(', ')}}`;
    } else if (name === '__type') {
      return 'object';
    } else {
      console.log('!!!!!!!!!!1', name, type);
      return name;
    }
  }
}

function intend(n: number) {
  let str = '';
  while (n--) {
    str += '  ';
  }
  return str;
}

function getChildren(node: ts.Node) {
  const nodes: ts.Node[] = [];
  ts.forEachChild(node, node => {
    nodes.push(node);
  });
  return nodes;
}

function checkNode(node: ts.Node, checker: ts.TypeChecker) {
  if (node.kind !== ts.SyntaxKind.FirstStatement) {
    return;
  }
  // FirstStatement
  //    ExportKeyword
  //    VariableDeclarationList
  //      VariableDeclaration
  //        Identifier
  //        CallExpression
  //          Identifier
  //          ObjectLiteralExpression
  //            PropertyAssignment
  //              Identifier
  //              TrueKeyword
  //            PropertyAssignment
  //              Identifier
  //              StringLiteral
  //            PropertyAssignment
  //              Identifier
  //              Identifier

  // ts.forEachChild(children => {

  // })

  const [exportKeywordNode, variableDeclarationList] = getChildren(node);
  // if (exportKeywordNode && variableDeclarationList) {
  //   console.log(
  //     ts.SyntaxKind[exportKeywordNode.kind],
  //     ts.SyntaxKind[variableDeclarationList.kind]
  //   );
  // }
  if (
    !exportKeywordNode ||
    exportKeywordNode.kind !== ts.SyntaxKind.ExportKeyword ||
    !variableDeclarationList ||
    variableDeclarationList.kind !== ts.SyntaxKind.VariableDeclarationList
  ) {
    return;
  }
  const [variableDeclaration] = getChildren(variableDeclarationList);
  const declaration = ts.getNameOfDeclaration(
    variableDeclaration as ts.Declaration
  );
  // console.log(
  //   variableDeclaration && ts.SyntaxKind[variableDeclaration.kind],
  //   identifier && ts.SyntaxKind[identifier.kind]
  // );
  // console.log((declaration as ts.Identifier).escapedText?.toString());
  const exportName = (declaration as ts.Identifier).escapedText?.toString();
  if (exportName !== 'registerRpc') {
    return;
  }
  const [, callExpression] = getChildren(variableDeclaration);
  if (
    ((callExpression as ts.CallExpression)
      ?.expression as ts.Identifier).escapedText?.toString() !==
    'createRpcBinding'
  ) {
    return;
  }

  const [, objectLiteralExpression] = getChildren(callExpression);

  const props = getChildren(objectLiteralExpression) as ts.PropertyAssignment[];

  props.forEach(prop => {
    const name = (prop.name as ts.Identifier).escapedText?.toString();
    if (name === 'handler') {
      const fn = prop.initializer;
      const contractType = checker.getTypeAtLocation(fn);
      const signature = checker.getSignaturesOfType(contractType, 0)[0];
      // console.log(ts.SyntaxKind[fn.kind]);
      // console.log(s);

      const returnType = checker.typeToString(
        signature.getReturnType(),
        undefined,
        ts.TypeFormatFlags.NoTruncation |
          ts.TypeFormatFlags.UseFullyQualifiedType
        // ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
        // ts.TypeFormatFlags.MultilineObjectLiterals
      );

      const params = signature.parameters.map(param => {
        var type = checker.getTypeOfSymbolAtLocation(
          param,
          param.valueDeclaration!
        );
        // console.log(type);
        return checker.typeToString(type);
      });

      console.log({
        params,
        returnType,
      });

      // const returnType = checker.typeToString(
      //   t.getReturnType(),
      //   undefined,
      //   ts.TypeFormatFlags.NoTruncation |
      //     ts.TypeFormatFlags.UseFullyQualifiedType
      //   // ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
      //   // ts.TypeFormatFlags.MultilineObjectLiterals
      // );
      // console.log(returnType)

      // console.log(prop.initializer);
      // console.log(getChildren(prop.initializer));
    }
  });

  // console.log(getChildren(objectLiteralExpression));
  // console.log(
  //   getChildren(objectLiteralExpression).map(node => ts.SyntaxKind[node.kind])
  // );
}

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  console.log({ fileNames });
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, item => {
        checkNode(item, checker);

        // visit(item, false, 0);
      });
    }
  }

  // print out the doc
  // fs.writeFileSync('classes.json', JSON.stringify(output, undefined, 4));
  // console.log(output);

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node, isExported = false, depth = 0) {
    // Only consider exported nodes
    // if (!isNodeExported(node) && !isExported) {
    //   return;
    // }
    if (
      [
        ts.SyntaxKind.ImportDeclaration,
        ts.SyntaxKind.EndOfFileToken,
        ts.SyntaxKind.ClassDeclaration,
        ts.SyntaxKind.TypeAliasDeclaration,
        ts.SyntaxKind.InterfaceDeclaration,
      ].includes(node.kind)
    ) {
      return;
    }

    if (node.kind === ts.SyntaxKind.VariableDeclaration) {
      // console.log(ts.getNameOfDeclaration(node));
      // console.log(node.);
    }

    console.log(intend(depth) + ts.SyntaxKind[node.kind]);

    if (ts.isCallExpression(node)) {
      // const signature = checker.getSignaturesOfType(node);
      // console.log(serializeObject(signature));
    }

    const convertType = (type: ts.Type) => {
      if (!type.symbol && !type.aliasSymbol) {
        return checker.typeToString(type);
      }
      return travelType(type);
    };

    if (node.kind === ts.SyntaxKind.ArrowFunction) {
      // node.
      const t = checker.getTypeAtLocation(node);
      const s = checker.getSignaturesOfType(t, 0);
      // console.log(s);
      // console.log(
      //   checker.typeToString(
      //     s[0].resolvedReturnType,
      //     undefined,
      //     ts.TypeFormatFlags.NoTruncation |
      //       ts.TypeFormatFlags.UseFullyQualifiedType
      //     // ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
      //     // ts.TypeFormatFlags.MultilineObjectLiterals
      //   )
      // );
      // console.log(s[0].resolvedReturnType.typeArguments[0]);
      // console.log(s[0].parameters);

      s.forEach(item => {
        const returnType = checker.typeToString(
          item.getReturnType(),
          undefined,
          ts.TypeFormatFlags.NoTruncation |
            ts.TypeFormatFlags.UseFullyQualifiedType
          // ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
          // ts.TypeFormatFlags.MultilineObjectLiterals
        );
        if (!returnType.includes('AuthData')) {
          return;
        }
        item.parameters.forEach(param => {
          var type = checker.getTypeOfSymbolAtLocation(
            param,
            param.valueDeclaration!
          );
          // console.log(type);
          console.log(checker.typeToString(type));
        });

        console.log(
          checker.typeToString(
            item.getReturnType(),
            undefined,
            ts.TypeFormatFlags.NoTruncation |
              ts.TypeFormatFlags.UseFullyQualifiedType
            // ts.TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
            // ts.TypeFormatFlags.MultilineObjectLiterals
          )
        );
        // console.log(checker.getSignaturesOfType(t, 0));
      });

      // var a = checker.getTypeOfSymbolAtLocation(
      //   s[0].parameters[0],
      //   s[0].parameters[0].valueDeclaration!
      // );
      // var b = checker.getTypeOfSymbolAtLocation(
      //   s[0].parameters[1],
      //   s[0].parameters[1].valueDeclaration!
      // );
      // console.log('param1', a);
      // console.log('param2', b);

      // console.log('---------');
      // console.log('param1', checker.typeToString(a));
      // console.log('param2', checker.typeToString(b));
      // console.log(checker.getSignaturesOfType(t, 0));
      const symbol = t.symbol;
      // console.log(t);
      if (symbol) {
        // console.log(
        //   checker.typeToString(
        //     checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
        //   )
        // );
      }
    }

    // if (ts.isFunctionDeclaration(node)) {
    // try {
    //   const t = checker.getTypeAtLocation(node);
    //   const symbol = t.symbol;
    //   if (symbol) {
    //     console.log(
    //       checker.typeToString(
    //         checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
    //       )
    //     );
    //   }
    // } catch (e) {}
    ts.forEachChild(node, item => {
      visit(item, isExported, depth + 1);
    });

    // checker.getResolvedSignature(node)
    // }

    // if (ts.isVariableStatement(node)) {
    //   // if (!node.getText().includes('createContract(')) {
    //   //   return;
    //   // }
    //   const print = (node: ts.Node, prefix: string) => {
    //     // console.log('---------');
    //     if (ts.isCallExpression(node)) {
    //       const signature = checker.getResolvedSignature(node);
    //       if (signature) {
    //         console.log(checker.signatureToString(signature));
    //       }
    //       // ts.isFunctionExpression;
    //       // node.expression.     escapedText
    //       const expression = node.expression;
    //       if (ts.isIdentifier(expression)) {
    //         // console.log('!!!!!!!!!!!!!!!!!!!!!!!1', ts.idText(expression));
    //       }
    //       // console.log(prefix, serializeObject(node));
    //     }
    //     if (ts.isPropertyAccessExpression(node)) {
    //       // if (ts.idText(node.name) === 'fn') {
    //       //   // console.log('#############3', node);
    //       //   // console.log(serializeObject(node));
    //       //   const type = checker.getTypeAtLocation(node.expression.expression);
    //       //   console.log(type);
    //       // }
    //     }
    //     if (ts.isArrowFunction(node)) {
    //       // const arg1 = node.parameters[0];
    //       // if (ts.isParameter(arg1)) {
    //       //   const type = checker.getTypeAtLocation(node);
    //       //   const a = checker.getResolvedSignature(node);
    //       //   console.log('#############3', a);
    //       // }
    //       // // console.log('###############', node.parameters);
    //       // console.log(node);
    //       // console.log('-----------');
    //       // console.log(
    //       //   serializeObject(
    //       //     checker.getSignatureFromDeclaration(
    //       //       checker.getTypeAtLocation(node).symbol.declarations[0]
    //       //     )
    //       //   )
    //       // );
    //       // console.log('-----------');
    //       // console.log(
    //       //   checker.getTypeAtLocation(node).symbol.declarations[0].parameters[0]
    //       // );
    //     }
    //     try {
    //       const a = checker.getResolvedSignature(node);
    //       if (a && a.typeParameters && a.typeParameters.length) {
    //         // console.log(a);
    //       }
    //     } catch (e) {}
    //     try {
    //       const s = checker.getSymbolAtLocation(node);
    //       if (s) {
    //         // console.log(s);
    //       }
    //     } catch (e) {}

    //     // console.log(
    //     //   prefix + '' + kindMap[node.kind],
    //     //   // JSON.stringify(node.getText())
    //     //   serializeObject(node)
    //     // );

    //     ts.forEachChild(node, x => {
    //       print(x, prefix + '  ');
    //     });
    //   };
    //   print(node, '');
    //   // console.log(node);
    //   // console.log('----');
    //   // // ts.symbolName(node.s)
    //   // ts.forEachChild(node, x => {
    //   //   console.log(x.kind);
    //   //   if (x.kind === ts.SyntaxKind.VariableDeclarationList) {
    //   //     console.log('VariableDeclarationList:');
    //   //     ts.forEachChild(x, x => {
    //   //       console.log(x.kind);
    //   //       if (x.kind === ts.SyntaxKind.VariableDeclarationList) {
    //   //       }
    //   //     });
    //   //   }
    //   // });
    //   // console.log('\n\n', node.getText());
    //   // console.log(node);
    // }
    // // console.log({
    // //   text: node.getText(),
    // // });
    // // if (node.getText().includes('createContract')) {
    // //   console.log(node);
    // // }
    // // ts.SyntaxKind.
    // // console.log('exported');
    // if (ts.isFunctionExpression(node)) {
    //   console.log(node.name);
    // }

    // if (ts.isClassDeclaration(node) && node.name) {
    //   // This is a top level class, get its symbol
    //   let symbol = checker.getSymbolAtLocation(node.name);
    //   if (symbol) {
    //     output.push(serializeClass(symbol));
    //   }
    //   // No need to walk any further, class expressions/inner declarations
    //   // cannot be exported
    // } else if (ts.isModuleDeclaration(node)) {
    //   // This is a namespace, visit its children
    //   ts.forEachChild(node, visit);
    // }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol): DocEntry {
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment()),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)
      ),
    };
  }

  /** Serialize a class symbol information */
  function serializeClass(symbol: ts.Symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
      documentation: ts.displayPartsToString(
        signature.getDocumentationComment()
      ),
    };
  }
}

generateDocumentation(process.argv.slice(2), {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  strict: true,
  noImplicitAny: true,
  strictNullChecks: true,
  noUnusedLocals: true,
  noImplicitReturns: true,
  noFallthroughCasesInSwitch: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
});
